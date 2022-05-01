export class RegistrationModel {
    constructor(
        public fullName: String,
        public email: String,
        public bio: String,
        public username: String,
        public password: String,
        public lastOnline: String
    ) { }
}