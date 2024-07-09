import React, { useEffect, useState } from 'react';
import { IMessage } from '@stomp/stompjs';
import WebSocketService from '../utils/WebSocketService';

export type NotificationType = {
    message: string;
    sender_code: string;
    recipient_code:string;
    request_id: string;
    topic_code:string;
    read: string;
    created_on:string;

}

const NotificationWebSocket: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);

    useEffect(() => {
        WebSocketService.connect();
        WebSocketService.getClient().onConnect = () => {
            WebSocketService.getClient().subscribe('/topic/notifications', (message: IMessage) => {
                console.log(JSON.parse(message.body));
                setNotifications(prevNotifications => [...prevNotifications, JSON.parse(message.body)]);
            });
        };

        return () => {
            WebSocketService.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Notifications</h1>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>{notification.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationWebSocket;
