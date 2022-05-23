import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CallUser, PeerService } from 'src/app/services/video/peer.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-videoconf',
  templateUrl: './videoconf.component.html',
  styleUrls: ['./videoconf.component.css']
})
export class VideoconfComponent implements OnInit {

  public localStream!: MediaStream;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private peerService: PeerService, private webSocket: WebSocketService) { }

  getMediaStream(constraints?: MediaStreamConstraints): Promise<MediaStream> {
    return new Promise<MediaStream>((resolve, reject) => {
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        resolve(stream);
      }).catch(() => {
        alert('Have an error when access to camera/micro');
        reject();
      })
    }
    )
  }

  startUserStream() {
    this.getMediaStream({ video: true, audio: true }).then(stream => {
      this.localStream = stream;
      this.openPeer();
    })
  }

  ngOnInit(): void {
    this.roomId = "" + this.activatedRoute.snapshot.paramMap.get('roomid');
    console.log(this.roomId)
    this.startUserStream();
    this.hanleUserConnect()
  }

  /*fromhere*/
  public joinedUsers: CallUser[] = [];
  public roomId: string = '';
  public isHideChat = true;

  consolethis() {
    console.log(this.joinedUsers)
  }



  ngAfterViewInit(): void {
    this.listenNewUser();
    this.listenLeavedUser();
    this.detectScreenWith();
  }


  hideOrUnhideChat(): void {
    this.isHideChat = !this.isHideChat;
  }

  private detectScreenWith(): void {
    if (window.screen.width > 719) {
      setTimeout(() => {
        this.isHideChat = false;
      }, 200);
    }
  }

  public joinedId = new BehaviorSubject(null);
  public leavedId = new BehaviorSubject(null);

  private hanleUserConnect(): void {
    this.webSocket.listen('user-connected').subscribe((userId: any) => {
      this.joinedId.next(userId);
    })
    this.webSocket.listen('user-disconnected').subscribe((userId: any) => {
      this.leavedId.next(userId);
    })
  }

  private listenNewUser(): void {
    this.listenNewUserJoinRoom();
    this.listenNewUserStream();
  }

  private listenLeavedUser(): void {
    this.leavedId.subscribe(userPeerId => {
      this.joinedUsers = this.joinedUsers.filter(x => x.peerId != userPeerId);
    })
  }

  private listenNewUserJoinRoom(): void {
    this.joinedId.subscribe(newUserId => {
      if (newUserId) {
        this.makeCall(newUserId);
      }
    })
  }

  private listenNewUserStream(): void {
    this.peerService.joinUser.subscribe(user => {
      if (user) {
        // if (user.peerId) {
          if (this.joinedUsers.findIndex(u => u.peerId === user.peerId) < 0) {
            this.joinedUsers.push(user);
          }
        // }
      }
    })
  }

  private openPeer(): void {
    this.peerService.openPeer(this.localStream).then((myPeerId: any) => {
      this.joinRoom(this.roomId, myPeerId);
    })
  }

  private makeCall(anotherPeerId: string): void {
    this.peerService.call(anotherPeerId, this.localStream);
  }

  private joinRoom(roomId: string, userPeerId: string): void {
    console.log(userPeerId)
    this.webSocket.emit('join-room', { "roomId": roomId, "userId": userPeerId });
  }


}
