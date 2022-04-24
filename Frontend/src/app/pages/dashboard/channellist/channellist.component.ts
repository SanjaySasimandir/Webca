import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsersChannelModel, UsersGroupModel } from 'src/app/models/group.model';
import { UserauthService } from 'src/app/services/userauth.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { AddChannelDialogComponent } from './add-channel-dialog/add-channel-dialog.component';
@Component({
  selector: 'app-channellist',
  templateUrl: './channellist.component.html',
  styleUrls: ['./channellist.component.css']
})
export class ChannellistComponent implements OnInit {
  @Input() selectedGroup = new UsersGroupModel('', '', '', '', []);
  @Input() selectedChannel = new UsersChannelModel('', '', '', '');


  constructor(private webSocket: WebSocketService, private dialog: MatDialog, private userAuth: UserauthService, private router: Router) { }

  addChannel() {
    this.dialog.open(AddChannelDialogComponent, {
      data: {
        "groupid": this.selectedGroup.groupid
      }
    });
  }

  inviteLink = "";
  getInviteString() {
    this.webSocket.emit('get invite string trigger', { groupid: this.selectedGroup.groupid });
  }

  socketListeners() {
    this.webSocket.listen('get invite string').subscribe((res: any) => {
      this.inviteLink = this.userAuth.host_address + '/invite/' + res.inviteString;
    });
  }

  initFunctions() {
    setTimeout(() => {
      this.getInviteString();
    }, 500);
  }

  ngOnInit(): void {
    // this.selectedChannel = this.selectedGroup.channels.filter(channel => channel.channelname == "main")[0];
    if (this.selectedGroup.groupname) {
      this.initFunctions();
      this.socketListeners();
    }
  }

}
