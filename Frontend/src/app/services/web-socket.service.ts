import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { UserauthService } from './userauth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: any;

  constructor(private userauthService: UserauthService) {
    if (userauthService.whetherLoggedIn()) {

      this.socket = io(this.userauthService.server_address + '?token=' + localStorage.getItem('token'), { transports: ['websocket', 'polling', 'flashsocket'] })
    }
  }
  connect() {
    this.socket.connect();
  }


  listen(eventName: String) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      })
    })
  }

  emit(eventName: String, data: any) {
    this.socket.emit(eventName, data);
  }

  listenOnce(eventName: String) {
    return new Observable((subscriber) => {
      this.socket.once(eventName, (data: any) => {
        subscriber.next(data);
      })
    })
  }

  off(eventName: String) {
    this.socket.off(eventName);
  }

  close() {
    this.socket.close();
  }
}
