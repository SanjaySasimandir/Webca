import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationModel } from '../models/registration.model';

@Injectable({
  providedIn: 'root'
})
export class UserauthService {

  constructor(private http: HttpClient) { }

  server_address = "http://192.168.1.3:3000/"; //localhost as IPv4 address
  // server_address = "http://172.16.63.127:3000/"; //localhost as IPv4 address
  // server_address = "http://localhost:3000/"; //localhost
  // server_address = "https://webca-app.herokuapp.com/"; //heroku
  server_users_address = this.server_address + "users/";

  dupeUsernameCheck(username: string) {
    return this.http.post<any>(this.server_users_address + 'dupeUsernameCheck', { "username": username });
  }

  dupeEmailCheck(email: string) {
    return this.http.post<any>(this.server_users_address + 'dupeEmailCheck', { "email": email });
  }

  signup(user: any) {
    return this.http.post<any>(this.server_users_address + 'signup', { "user": user });
  }

  login(creds: any) {
    return this.http.post<any>(this.server_users_address + 'login', { "creds": creds });
  }
  getPFP() {
    return this.http.post<any>(this.server_users_address + 'getPFP', { "token": localStorage.getItem('token') });
  }

  whetherLoggedIn() {
    return !!localStorage.getItem('token');
  }

  logOut() {
    localStorage.removeItem('token');
  }

  server_verify_address = this.server_address + "verify/";

  initiateMailVerification(email: string) {
    return this.http.post<any>(this.server_verify_address + 'initiateMailVerification', { "email": email });
  }

  verifyMailOtp(email: string, otp: string) {
    return this.http.post<any>(this.server_verify_address + 'verifyMailOtp', { "email": email, "otp": otp });
  }
}
