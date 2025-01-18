export interface Message {
    id: number;
    senderId: number;
    text: string;
    timestamp: Date;
  }
  
  export interface Chat {
    id: number;
    name: string;
    message: string;
    time: string;
    unread: number;
  }
  
  