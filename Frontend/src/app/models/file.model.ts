export class FileModel {
    constructor(
        public name: String,
        public author: String,
        public uploadDate: String,
        public filelocation: String,
        public filetype: String
    ) { }
}

export class FolderModel {
    constructor(
        public _id: String,
        public name: String,
        public author: String,
        public channelid: String,
        public creationDate: String,
        public files: FileModel[],
        public folders: foldersModel[]
    ) { }
}

export class foldersModel {
    constructor(
        public name: String,
        public folderid: String,
    ) { }
}