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


export class Participant {

  public static setParticipant(participant: string): void {
    localStorage.setItem("PARTICIPANT", participant);
  }

  public static getParticipant(): Map<string,object> {
    return new Map(Object.entries(JSON.parse(localStorage.getItem('PARTICIPANT') || "{}")));
  }

  public static hasParticipant(): boolean {
    return localStorage.getItem("PARTICIPANT") !== null;
  }

  public static getParticipantName(): string {
    return String(this.getParticipant().get('participant_name'))?.replace(/"/g, '') || "";
  } 
}

