import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserauthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private userauthService: UserauthService, private router: Router) { }

  loggedIn = false;
  logout() {
    this.userauthService.logOut();
    this.router.navigate(['/login']);
  }
  loadedPage = '';
  ngOnInit(): void {
    this.loggedIn = this.userauthService.whetherLoggedIn();
    this.loadedPage = this.router.url;
  }

}
