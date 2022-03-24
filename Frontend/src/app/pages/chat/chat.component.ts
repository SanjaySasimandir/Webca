import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserauthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private router: Router, public userAuth: UserauthService, private _snackBar: MatSnackBar) { }

  newMessageSnackBar(contactName: string) {
    this._snackBar.open('@' + contactName + ' sent you a message', '', {
      duration: 5000,
    });
  }

  logout() {
    this.userAuth.logOut();
    this.router.navigate(['/login']);
  }



  consolefunction() {
    console.log('here from parent')
  }



  viewSearchResults: boolean = false;
  hideSearchResults() {
    setTimeout(() => {
      this.viewSearchResults = false;
    }, 300);
  }

  profilePicture: string = '';

  ngOnInit(): void {

  }

}
