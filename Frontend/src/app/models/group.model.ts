export class UsersGroupModel {
    constructor(
        public groupname: string,
        public groupid: string,
        public grouppicture: string,
        public grouprole: string,
        public channels: UsersChannelModel[]
    ) { }
}

export class UsersChannelModel {
    constructor(

        public channelname: string,
        public channelid: string,
        public channelpicture: string,
        public channelrole: string,

    ) { }
}