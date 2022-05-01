export class SendMessageModel {
    constructor(
        public channelid: string,
        public messageType: string,
        public message: any,
        public messageTime: string,
        public messageSender: MessageSender,
    ) { }
}
export class MessageSender {
    constructor(
        public username: string,
        public fullname: string
    ) { }
}