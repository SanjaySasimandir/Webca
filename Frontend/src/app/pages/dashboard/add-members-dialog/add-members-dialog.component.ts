import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserauthService } from 'src/app/services/userauth.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ViewmembersComponent } from '../channellist/viewmembers/viewmembers.component';

@Component({
  selector: 'app-add-members-dialog',
  templateUrl: './add-members-dialog.component.html',
  styleUrls: ['./add-members-dialog.component.css']
})
export class AddMembersDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ViewmembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private webSocket: WebSocketService,
    private userauth: UserauthService) { }

  addUser(member: any) {
    this.webSocket.emit('add user to channel', {
      "token": localStorage.getItem('token'),
      "channelid": this.data.selectedChannel.channelid,
      "member": member
    });
    this.members = this.members.filter((itermember: any) => itermember.id != member.id);
  }

  public backendurl = this.userauth.server_address;
  initFunctions() {
    this.webSocket.emit('get members to add trigger', {
      "token": localStorage.getItem('token'),
      "selectedchannelid": this.data.selectedChannel.channelid,
      "mainchannelid": this.data.selectedGroup.channels[0].channelid,
      "role": this.data.role
    });
  }

  members: any = []
  socketListeners() {
    this.webSocket.listenOnce('get members to add').subscribe((data: any) => {
      this.members = data.memberstoadd;
    });
  }

  ngOnInit(): void {
    this.initFunctions()
    this.socketListeners()
  }

  ngOnDestroy() {
    this.webSocket.off('get members to add');
  }

}
