import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrls: ['./add-channel-dialog.component.css']
})
export class AddChannelDialogComponent implements OnInit {

  constructor(private webSocket: WebSocketService, private dialogRef: MatDialogRef<AddChannelDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  channelname = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]);
  openness = new FormControl('inviteOnly', [Validators.required]);

  createChannel() {
    this.webSocket.emit('add channel', {
      "channelname": this.channelname.value,
      "groupid": this.data.groupid,
      "token": localStorage.getItem('token'),
      "openness": this.openness.value,
      "grouprole": this.data.grouprole,
    });
    this.dialogRef.close();
  }

  dupeChannelCheck() {
    this.webSocket.emit('dupe channel check', { "channelname": this.channelname.value, "groupid": this.data.groupid });

  }

  socketListeners() {
    this.webSocket.listen('dupe channel check result').subscribe((res: any) => {
      if (res.message == true) {
        this.channelname.setErrors({ exists: true });
      }
    });
  }

  ngOnInit(): void {

    this.socketListeners();
  }

  ngOnDestroy(): void {
    this.webSocket.off('dupe channel check result');
  }

}
