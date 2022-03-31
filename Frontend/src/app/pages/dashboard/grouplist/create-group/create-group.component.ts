import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CreateGroupComponent>, private groupService: GroupService) { }

  dialogClose() {
    this.dialogRef.close();
  }

  groupname = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]);
  openness = new FormControl('invite-only', [Validators.required]);

  createGroup() {
    console.log('create group')
    this.groupService.createGroup({ "groupname": this.groupname.value, "openness": this.openness.value, "token": localStorage.getItem('token') }).subscribe(res => {
      console.log(res);
    });
    this.dialogClose();
  }

  ngOnInit(): void {

  }

}
