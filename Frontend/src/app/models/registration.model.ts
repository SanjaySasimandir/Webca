export class RegistrationModel {
    constructor(
        public username: String,
        public fullName: String,
        public email: String,
        public password: String,
        public lastOnline: String,
        public chats: Array<1000>,
        public role: String
    ){}
}