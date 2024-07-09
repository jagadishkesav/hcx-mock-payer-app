import { Client, StompSubscription, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    private client!: Client;
    private subscription: StompSubscription | null = null;

    connect() {
        this.client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected');
                this.subscription = this.client.subscribe('/topic/notifications', this.onMessageReceived);
            },
            onStompError: (frame) => {
                console.error(frame);
            }
        });
        this.client.activate();
    }

    disconnect() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.client) {
            this.client.deactivate();
        }
    }

    private onMessageReceived = (message: IMessage) => {
        console.log(JSON.parse(message.body));
        // You can add additional handling here
    }

    public getClient(): Client {
        return this.client;
    }
}

export default new WebSocketService();
