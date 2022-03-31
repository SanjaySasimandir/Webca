import { Component, Input, OnInit } from '@angular/core';
import { UsersGroupModel } from 'src/app/models/group.model';

@Component({
  selector: 'app-channellist',
  templateUrl: './channellist.component.html',
  styleUrls: ['./channellist.component.css']
})
export class ChannellistComponent implements OnInit {
  @Input() selectedGroup = new UsersGroupModel('', '', '', '', []);

  constructor() { }

  ngOnInit(): void {
  }

}
