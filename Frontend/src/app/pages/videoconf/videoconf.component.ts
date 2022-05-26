import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UsersChannelModel } from 'src/app/models/group.model';
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

  public joinedUsers: CallUser[] = [];
  public roomId: string = '';
  public isHideChat = true;

  fetchChannel(roomid: String) {
    this.webSocket.emit('fetch channel and attendance', { "token": localStorage.getItem('token'), "roomid": roomid })
  }

  pageloading = true;
  invalidLink = false;
  linkexpired = false;
  userNotAuthorized = false;
  userIsMember = false;
  invalidRoomListener() {
    this.webSocket.listen('invalid room link').subscribe((res: any) => {
      if (res.message === 'invalid link') {
        this.invalidLink = true;
        this.pageloading = false;
      }
      else if (res.message === 'link expired') {
        this.linkexpired = true;
        this.pageloading = false;
      }
      else if (res.message === 'not authorized') {
        this.userNotAuthorized = true;
        this.pageloading = false;
      }
    });
  }

  selectedChannel = new UsersChannelModel('', '', '', '');
  socketListeners() {
    this.invalidRoomListener();
    this.webSocket.listenOnce('get video room channel').subscribe((res: any) => {
      this.selectedChannel = res.channel;
      this.userIsMember = true;
      this.pageloading = false;
    });
  }


  initialFunctions() {
    this.startUserStream();
    this.handleUserConnect();
    this.listenNewUser();
    this.listenLeavedUser();
  }

  public initialScreenWidth = 1000;
  ngOnInit(): void {
    this.initialScreenWidth = window.screen.width;
    this.socketListeners();
    this.roomId = "" + this.activatedRoute.snapshot.paramMap.get('roomid');
    this.fetchChannel(this.roomId);
    this.initialFunctions();
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
  public joinedUsersDetails = new Map();
  private handleUserConnect(): void {
    // this.webSocket.listen('user-connected').subscribe((userId: any) => {
    //   this.joinedId.next(userId);
    // })
    this.webSocket.listen('user-connected').subscribe((res: any) => {
      this.joinedId.next(res.userId);
      this.joinedUsersDetails.set(res.userId, res.details);
    });
    this.webSocket.listen('user-disconnected').subscribe((userId: any) => {
      this.leavedId.next(userId);
    });
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
        if (user.peerId) {
          if (this.joinedUsers.findIndex(u => u.peerId === user.peerId) < 0) {
            this.joinedUsers.push(user);
          }
        }
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
    this.webSocket.emit('join-room', {
      "roomId": roomId,
      "userId": userPeerId,
      "fullname": localStorage.getItem('fullname'),
      "username": localStorage.getItem('username')
    });
  }


}
