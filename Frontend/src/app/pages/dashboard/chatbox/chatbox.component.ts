import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UsersChannelModel } from 'src/app/models/group.model';
import { SendMessageModel } from 'src/app/models/sendmessage.model';
import * as moment from "moment";
import { WebSocketService } from 'src/app/services/web-socket.service';
import { MessageSender } from 'src/app/models/sendmessage.model';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  @Input() selectedChannel = new UsersChannelModel('', '', '', '');

  constructor(private webSocket: WebSocketService) { }

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
  sendMessage() {
    let newMessage = new SendMessageModel(
      this.selectedChannel.channelid,
      'text',
      this.newMessage.value,
      moment().format('LT'),
      new MessageSender(
        this.username,
        this.fullname,
      ));
    this.webSocket.emit('send message', newMessage);
  }

  socketListeners() {
    
  }

  ngOnInit(): void {
    this.socketListeners();
  }

}
