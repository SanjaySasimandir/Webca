import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationModel } from '../models/registration.model';

@Injectable({
  providedIn: 'root'
})
export class UserauthService {

  constructor(private http: HttpClient) { }

  server_address = "http://192.168.1.4:3000/"; //localhost as IPv4 address
  // server_address = "http://localhost:3000/"; //localhost
  // server_address = "https://webca-app.herokuapp.com/"; //heroku
  server_users_address = this.server_address + "users/";

  dupeUsernameCheck(username: string) {
    return this.http.post<any>(this.server_users_address + 'dupeUsernameCheck', { "username": username });
  }

  dupeEmailCheck(email: string) {
    return this.http.post<any>(this.server_users_address + 'dupeEmailCheck', { "email": email });
  }

  signup(user: RegistrationModel) {
    return this.http.post<any>(this.server_users_address + 'signup', { "user": user });
  }

  login(creds: any) {
    return this.http.post<any>(this.server_users_address + 'login', { "creds": creds });
  }

  whetherLoggedIn() {
    return !!localStorage.getItem('token');
  }

  logOut() {
    localStorage.removeItem('token');
  }
}
