import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsersChannelModel, UsersGroupModel } from 'src/app/models/group.model';
import { UserauthService } from 'src/app/services/userauth.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ChannellistComponent } from '../channellist/channellist.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NewMessageSnackBarComponent } from '../grouplist/new-message-snack-bar/new-message-snack-bar.component';

@Component({
  selector: 'app-grouplist',
  templateUrl: './grouplist.component.html',
  styleUrls: ['./grouplist.component.css'],
})
export class GrouplistComponent implements OnInit {
  @ViewChild(ChannellistComponent) channelList!: ChannellistComponent;

  constructor(public dialog: MatDialog,
    private webSocket: WebSocketService,
    private userAuth: UserauthService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  groupname = new FormControl('', [Validators.required, Validators.minLength(5)]);
  openness = new FormControl('invite-only', [Validators.required])

  openDialog() {
    const dialogRef = this.dialog.open(CreateGroupComponent);
  }

  logout() {
    this.selectedGroup = new UsersGroupModel('', '', '', '', []);
    this.selectedChannel = new UsersChannelModel('', '', '', '');
    this.userAuth.logOut();
    this.webSocket.close();
    // this.router.navigate(['/login']);
    window.location.replace('');
  }

  profilePicture: String = "";
  loadProfilePicture() {
    this.userAuth.getPFP().subscribe(data => {
      if (data.pfpURL) {
        this.profilePicture = this.userAuth.server_address + data.pfpURL;
      }
    });
  }

  groups: UsersGroupModel[] = [];
  loadGroupList() {
    this.webSocket.connect();
    this.webSocket.emit('get groups trigger', {});
  }

  selectedGroup = new UsersGroupModel('', '', '', '', []);
  selectedChannel = new UsersChannelModel('', '', '', '');
  groupsbackup: UsersGroupModel[] = [];
  channelsbackup: UsersChannelModel[] = [];
  selectGroup(group: UsersGroupModel) {
    this.selectedGroup = group;
    this.groupsbackup = this.groups;
    this.groups = [];
    this.groups = this.groupsbackup;
    this.selectedChannel = this.selectedGroup.channels.filter(channel => channel.channelname == "main")[0];
    this.refreshChannelList();
  }

  refreshChannelList() {
    if (this.channelList) {
      this.channelList.ngOnInit()
    }
  }
  socketListeners() {
    this.webSocket.listen('get groups').subscribe((res: any) => {
      this.groups = res;
      console.log(this.groups)
      if (this.selectedChannel.channelid) {
        this.selectedGroup = this.groups.filter(group => group.groupid == this.selectedGroup.groupid)[0];
      }
      this.refreshChannelList();
      setTimeout(() => this.refreshChannelList(), 200);

      this.loadProfilePicture();
    });

    this.webSocket.listen('new message received').subscribe((res: any) => {
      this.openSnackBar(res);
    });
  }

  openSnackBar(res: any) {
    this.snackBar.openFromComponent(NewMessageSnackBarComponent, {
      duration: 3000,
      data: { "res": res }
    })
  }

  ngOnInit(): void {
    this.loadGroupList();
    this.socketListeners();
  }
}
