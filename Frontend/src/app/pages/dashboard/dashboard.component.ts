import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserauthService } from 'src/app/services/userauth.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, public userAuth: UserauthService, private _snackBar: MatSnackBar, private webSocket: WebSocketService) { }

  logout() {
    this.userAuth.logOut();
    this.router.navigate(['/login']);
  }

  profilePicture: any;
  loadProfilePicture() {
    this.userAuth.getPFP().subscribe(data => {
      if (data.pfpURL) {
        this.profilePicture = this.userAuth.server_address + data.pfpURL;
      }
    });
  }

  ngOnInit(): void {
    this.webSocket.listen("connect_error").subscribe(err => {
      console.log(err);
    })
    this.webSocket.emit('token', localStorage.getItem('token'));
    this.loadProfilePicture();

  }

}
