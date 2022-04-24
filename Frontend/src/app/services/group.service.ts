import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserauthService } from './userauth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient, private userauthService: UserauthService) { }

  server_group_address = this.userauthService.server_address + 'groups/';

  createGroup(data: any) {
    return this.http.post<any>(this.server_group_address + 'create', { "data": data });
  }

  inviteInquiry(data: any) {
    return this.http.post<any>(this.server_group_address + 'inviteinquiry', { "data": data });
  }
}
