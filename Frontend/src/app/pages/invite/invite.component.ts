import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { UserauthService } from 'src/app/services/userauth.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private groupService: GroupService, private webSocket: WebSocketService, private router: Router, private userauth: UserauthService) { }

  inviteString = "";

  groupname = "";
  membercount = 0;
  picture = "";
  disable_buttons = true;

  joingroup() {
    this.webSocket.emit('join group', { "token": localStorage.getItem('token'), "inviteString": this.inviteString });
  }

  socketListeners() {
    this.webSocket.listen('join group response').subscribe((res: any) => {
      console.log(res);
      if(res.message=="done"){
        this.router.navigateByUrl('/');
      }
    });
  }

  inviteInquiry() {
    this.groupService.inviteInquiry({ "token": localStorage.getItem('token'), "inviteString": this.inviteString }).subscribe((res) => {
      if (res.message === "member already") {
        this.router.navigateByUrl('/');
      }
      if (res.message === "not member") {
        this.disable_buttons = false;
        this.groupname = res.name;
        this.membercount = res.membercount;
        if (res.picture) {
          this.picture = this.userauth + res.picture;
        }
      }
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.inviteString = params['invitestring'];
      this.inviteInquiry();
    });
    this.socketListeners();
  }

}
