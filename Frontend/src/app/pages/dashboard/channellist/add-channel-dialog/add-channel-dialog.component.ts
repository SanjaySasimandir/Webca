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

  channelname = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]);

  createChannel() {
    this.webSocket.emit('add channel', { "channelname": this.channelname.value, "groupid": this.data.groupid, "token": localStorage.getItem('token') });
  }

  dupeChannelCheck() {
    this.webSocket.emit('dupe channel check', { "channelname": this.channelname.value, "groupid": this.data.groupid });
    this.webSocket.listen('dupe channel check result').subscribe(res => {
      console.log(res);
    });
  }

  ngOnInit(): void {
  }

}
