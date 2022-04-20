import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersChannelModel, UsersGroupModel } from 'src/app/models/group.model';
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


  constructor(private webSocket: WebSocketService, private dialog: MatDialog) { }

  addChannel() {
    this.dialog.open(AddChannelDialogComponent, {
      data: {
        "groupid": this.selectedGroup.groupid
      }
    });
  }

  ngOnInit(): void {
    // this.selectedChannel = this.selectedGroup.channels.filter(channel => channel.channelname == "main")[0];
  }

}
