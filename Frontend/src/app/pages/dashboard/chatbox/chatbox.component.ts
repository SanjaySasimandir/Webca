import { Component, Input, OnInit } from '@angular/core';
import { UsersChannelModel } from 'src/app/models/group.model';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  @Input() selectedChannel = new UsersChannelModel('', '', '', '');

  constructor() { }

  ngOnInit(): void {
  }

}
