export class SenderCode {

  public static setSenderCode(senderCode: string): void {
    localStorage.setItem("SENDER_CODE", senderCode);
  }

  public static getSenderCode(): string {
    return localStorage.getItem("SENDER_CODE") || "";
  }

  public static hasSenderCode(): boolean {
    return localStorage.getItem("SENDER_CODE") !== null;
  }
}
