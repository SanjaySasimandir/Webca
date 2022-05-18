import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UsersChannelModel } from 'src/app/models/group.model';
import { SendMessageModel } from 'src/app/models/sendmessage.model';
import * as moment from "moment";
import { WebSocketService } from 'src/app/services/web-socket.service';
import { MessageSender } from 'src/app/models/sendmessage.model';
import { Message, MessagesModel } from 'src/app/models/message.model';
import { MatDialog } from '@angular/material/dialog';
import { FilesComponent } from '../files/files.component';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  @Input() selectedChannel = new UsersChannelModel('', '', '', '');

  constructor(private webSocket: WebSocketService, private dialog: MatDialog) { }

  showfiles = false;
  openFiles() {
    this.dialog.open(FilesComponent, {
      data: {
        "selectedChannel": this.selectedChannel
      }
    });
  }

  uploadToggle = false;

  selectedImage!: FileList;
  imageSelected(element: any) {
    this.selectedImage = element.target.files;
    console.log(this.selectedImage)
  }

  sendImageSelected() {
    var file = this.selectedImage[0];
    var reader = new FileReader();
    reader.onload = this.readerLoaded.bind(this);
    reader.readAsBinaryString(file);
  }

  readerLoaded(evt: any) {
    var binaryString = evt.target.result;
  }


  username = "" + localStorage.getItem('username');
  fullname = "" + localStorage.getItem('fullname');
  newMessage = new FormControl("");
  messageToForward: any;
  chatIsLoading = false;

  sendMessage() {
    let newMessageObj = new SendMessageModel(
      this.selectedChannel.channelid,
      'text',
      this.newMessage.value,
      moment().format('LT'),
      new MessageSender(
        this.username,
        this.fullname,
      ));
    this.webSocket.emit('send message', newMessageObj);
    // this.loadedMessages.push(newMessageObj);
    let messageToPush = new Message(
      'text',
      this.newMessage.value,
      moment().format('LT'),
      {
        'username': this.username,
        "fullname": this.fullname,
        'id': 'same'
      });
    this.loadedMessages[this.loadedMessages.length - 1].messagesForTheDay.push(messageToPush);
    this.newMessage.setValue('');
  }

  loadedMessages: MessagesModel[] = [];
  recieveOldMessages() {
    this.webSocket.emit('get channel messages trigger', { 'channelid': this.selectedChannel.channelid, 'token': localStorage.getItem('token') });
    this.webSocket.listenOnce('get channel messages').subscribe((res: any) => {
      if (res.channelid == this.selectedChannel.channelid) {
        this.loadedMessages = res.messages;
      }
    });
  }

  recieveMessage() {
    this.webSocket.listen('new message received').subscribe((res: any) => {
      if (res.channelid == this.selectedChannel.channelid) {
        delete res.channelid;
        this.loadedMessages[this.loadedMessages.length - 1].messagesForTheDay.push(res)
      }
    });
  }

  socketListeners() {
    this.recieveOldMessages();
    this.recieveMessage();
  }




  ngOnInit(): void {
    this.socketListeners();
  }

}
