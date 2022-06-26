import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserauthService } from 'src/app/services/userauth.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-viewmembers',
  templateUrl: './viewmembers.component.html',
  styleUrls: ['./viewmembers.component.css']
})
export class ViewmembersComponent implements OnInit {


  constructor(private dialogRef: MatDialogRef<ViewmembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private webSocket: WebSocketService,
    private userauth: UserauthService) { }

  initFunctions() {
    this.webSocket.emit('get channel members trigger', { "channelid": this.data.mainchannelid });
  }
  public backendurl = this.userauth.server_address;

  changeRole(member: MemberModel) {
    this.webSocket.emit('change user group role', { "member": member, "channelid": this.data.mainchannelid, "groupid": this.data.groupid, "token": localStorage.getItem('token') });
  }
  members: MemberModel[] = [];
  socketListeners() {
    this.webSocket.listenOnce('get channel members').subscribe((res: any) => {
      this.members = res.members;
      // console.log(this.members[0])
    });
  }

  ngOnInit(): void {
    this.initFunctions();
    this.socketListeners();
  }

  ngOnDestroy() {
    this.webSocket.off('get channel members');
  }

}

export class MemberModel {
  constructor(
    public username: String,
    public fullname: String,
    public id: String,
    public role: String,
    public picture: String,
  ) { }
}