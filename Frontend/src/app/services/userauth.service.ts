import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserauthService {

  constructor(private http: HttpClient) { }

  localhost_address = "http://localhost:3000/";

  // Check whether username is unique
  usernameUniquenessCheck(username: string) {
    console.log(this.localhost_address + 'users/usernameUniqueCheck' + username);
    return this.http.get<any>(this.localhost_address + 'users/usernameUniqueCheck/' + username);
  }
}
