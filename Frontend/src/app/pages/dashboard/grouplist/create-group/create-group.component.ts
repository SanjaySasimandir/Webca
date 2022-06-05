import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GroupService } from 'src/app/services/group.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateGroupComponent>, private groupService: GroupService, private webSocket: WebSocketService) { }

  dialogClose() {
    this.dialogRef.close();
  }

  groupname = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]);
  openness = new FormControl('public', [Validators.required]);

  createGroup() {
    console.log('create group')
    this.groupService.createGroup({ "groupname": this.groupname.value, "openness": this.openness.value, "token": localStorage.getItem('token') }).subscribe(res => {
      console.log(res);
      this.webSocket.emit('get groups trigger',{});
    });
    this.dialogClose();
  }

  ngOnInit(): void {

  }

}
