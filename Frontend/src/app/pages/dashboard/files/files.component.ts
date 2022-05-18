import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from "moment";
import { FolderModel } from 'src/app/models/file.model';
import { UserauthService } from 'src/app/services/userauth.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<FilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private webSocket: WebSocketService,
    private http: HttpClient,
    private userauthService: UserauthService) { }

  selectedChannel: any;
  selectedFolder!: FolderModel;
  previous_folder_ids = [];



  uploadedFile: Array<File> = [];
  fileSelected(element: any) {
    console.log('selected');
    this.uploadedFile = element.target.files;
    this.uploadFile();
  }

  uploadFile() {
    let formData = new FormData();
    let splitname = this.uploadedFile[0].name.split('.');
    let filetype = splitname[splitname.length - 1];
    formData.append("uploads[]", this.uploadedFile[0], JSON.stringify({
      "username": localStorage.getItem('username'),
      "filename": this.uploadedFile[0].name,
      "channelid": this.selectedChannel.channelid,
      "filetype": filetype,
      "folderid": this.selectedFolder._id,
      "token": localStorage.getItem('token'),
    }) + '|&&&|' + this.uploadedFile[0].name);
    this.http.post(this.userauthService.server_address + 'files/uploadfile', formData).subscribe((status: any) => {
      if (status.message == 'success') {

      }
    });
  }

  createFolder() {
    console.log('createfolder called');
  }

  getMainFolder() {
    this.webSocket.emit('get main folder trigger', { "channelid": this.selectedChannel.channelid })
  }

  socketListeners() {
    this.webSocket.listenOnce('get main folder').subscribe((res: any) => {
      this.selectedFolder = res;
      console.log(this.selectedFolder);
    });
  }

  ngOnInit(): void {
    this.selectedChannel = this.data.selectedChannel;
    this.socketListeners();
    this.getMainFolder();
  }

  ngOnDestroy(): void {

  }

}
