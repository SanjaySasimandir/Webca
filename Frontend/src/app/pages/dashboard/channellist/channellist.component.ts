import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsersChannelModel, UsersGroupModel } from 'src/app/models/group.model';
import { UserauthService } from 'src/app/services/userauth.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ChatboxComponent } from '../chatbox/chatbox.component';
import { AddChannelDialogComponent } from './add-channel-dialog/add-channel-dialog.component';
@Component({
  selector: 'app-channellist',
  templateUrl: './channellist.component.html',
  styleUrls: ['./channellist.component.css']
})
export class ChannellistComponent implements OnInit {
  @Input() selectedGroup = new UsersGroupModel('', '', '', '', []);
  @Input() selectedChannel = new UsersChannelModel('', '', '', '');
  @ViewChild(ChatboxComponent) ChatBox!: ChatboxComponent;


  constructor(private webSocket: WebSocketService, private dialog: MatDialog, private userAuth: UserauthService, private router: Router) { }

  addChannel() {
    this.dialog.open(AddChannelDialogComponent, {
      data: {
        "groupid": this.selectedGroup.groupid,
        "role": this.selectedGroup.grouprole
      }
    });
  }

  refreshChatbox() {
    setTimeout(() => {
      this.ChatBox.ngOnInit();
    }, 200)
  }

  inviteLink = "";
  getInviteString() {
    this.webSocket.emit('get invite string trigger', { groupid: this.selectedGroup.groupid });
  }

  socketListeners() {
    this.webSocket.listen('get invite string').subscribe((res: any) => {
      this.inviteLink = this.userAuth.host_address + '/invite/' + res.inviteString;
    });

    // this.webSocket.listen('channel added').subscribe((res: any) => {
    //   console.log(res.groupid, this.selectedGroup.groupid)
    //   if (res.groupid == this.selectedGroup.groupid) {
    //     console.log('before', this.selectedGroup.channels);
    //     this.selectedGroup.channels.push(res.channel);
    //     console.log('after', this.selectedGroup.channels);
    //   }
    // });
  }

  initFunctions() {
    setTimeout(() => {
      this.getInviteString();
    }, 500);
  }

  ngOnInit(): void {
    if (this.selectedGroup.groupname) {
      this.initFunctions();
      this.socketListeners();
    }
    this.refreshChatbox();
  }

}
