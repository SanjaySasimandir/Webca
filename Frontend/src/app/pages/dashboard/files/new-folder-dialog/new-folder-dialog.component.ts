import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-new-folder-dialog',
  templateUrl: './new-folder-dialog.component.html',
  styleUrls: ['./new-folder-dialog.component.css']
})
export class NewFolderDialogComponent implements OnInit {

  constructor(private webSocket: WebSocketService, private dialogRef: MatDialogRef<NewFolderDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  foldername = new FormControl("", Validators.required);
  createFolder() {
    this.webSocket.emit('create folder', {
      "token": localStorage.getItem('token'),
      "folderid": this.data.folderid,
      "foldername": this.foldername.value,
      "channelid": this.data.channelid,
    });
    this.dialogRef.close();
  }

  closeDialog() {
    this.webSocket.off('refresh parent folder');
    this.dialogRef.close();
  }

  dupeFolderCheck() {
    let folderexists = !!this.data.folders.filter((folder: any) => folder.name == this.foldername.value).length;
    if (folderexists) {
      this.foldername.setErrors({ incorrect: true });
    }
  }

  ngOnInit(): void {
  }

}
