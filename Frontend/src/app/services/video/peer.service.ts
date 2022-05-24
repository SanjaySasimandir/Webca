import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Peer } from 'peerjs';
// declare var Peer: any;
export interface CallUser {
  peerId: string;
  stream: MediaStream;
}
@Injectable()
export class PeerService {
  public peer: any;
  public myPeerId!: string;
  // public joinUser = new BehaviorSubject<CallUser>(null); // use this if strict = false in tsconfig.json
  public joinUser = new BehaviorSubject<CallUser>({
    peerId: "",
    stream: new MediaStream()
  });
  public leaveUser = new BehaviorSubject<string>("null");
  public localStream!: MediaStream;
  constructor(private http: HttpClient) { }

  public openPeer(stream: MediaStream): Promise<string> {
    return new Promise<string>((resolve) => {
      this.initPeer();
      this.peer.on('open', (userPeerId: string) => {
        this.myPeerId = userPeerId
        this.handleInComingCall(stream);
        resolve(userPeerId);
      })
    });
  }

  public call(anotherPeerId: string, stream: MediaStream): void {
    var call = this.peer.call(anotherPeerId, stream);
    this.handelCall(call, anotherPeerId);
  }

  public handelCall(call: any, anotherPeerId: string): void {
    call.on('stream', (anotherStream: any) => {
      this.joinUser.next({ peerId: anotherPeerId, stream: anotherStream });
    })
  }

  private handleInComingCall(stream: MediaStream): void {
    this.peer.on('call', (call: any) => {
      call.answer(stream);
      call.on('stream', (anotherStream: any) => {
        this.joinUser.next({ peerId: call.peer, stream: anotherStream });
      })
    })
  }

  private initPeer(): void {
    this.peer = new Peer(this.myPeerId, {
      host: '/',
      port: 3001
    });
  }

}
