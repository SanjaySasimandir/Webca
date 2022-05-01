export class MessagesModel {
    constructor(
        public date: string,
        public messagesForTheDay: Message[]
    ) { }
}

export class Message {
    constructor(
        public messageType: string,
        public message: any,
        public messageTime: string,
        public messageSender: MessageSender,
    ) { }
}
export class MessageSender {
    constructor(
        public username: string,
        public fullname: string,
        public id: string
    ) { }
}