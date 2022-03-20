import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationModel } from '../models/registration.model';

@Injectable({
  providedIn: 'root'
})
export class UserauthService {

  constructor(private http: HttpClient) { }

  localhost_address = "http://localhost:3000/";

  // Check whether username is unique
  dupeUsernameCheck(username: string) {
    return this.http.post<any>(this.localhost_address + 'users/dupeUsernameCheck', { "username": username });
  }

  //register a new user
  signup(user: RegistrationModel) {
    return this.http.post<any>(this.localhost_address + 'users/signup', { "user": user });
  }
}
