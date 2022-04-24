import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private groupService: GroupService, private webSocket: WebSocketService) { }

  inviteString = "";

  groupname = "";
  membercount = 0;
  picture = "";

  joingroup() {
    this.webSocket.emit('join group', { "token": localStorage.getItem('token'), "inviteString": this.inviteString });
  }

  socketListeners() {
    this.webSocket.listen('join group response').subscribe((res: any) => {
      console.log(res);
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.inviteString = params['invitestring'];
      this.groupService.inviteInquiry({ "token": localStorage.getItem('token'), "inviteString": this.inviteString }).subscribe((res) => {
        if (res.message === "member already") {
          console.log('time to redirect');
        }
        if (res.message === "not member") {
          this.groupname = res.name;
          this.membercount = res.membercount;
          this.picture = res.picture;
        }
      });
    });
    this.socketListeners();
  }

}
