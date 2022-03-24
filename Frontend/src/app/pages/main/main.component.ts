import { Component, OnInit } from '@angular/core';
import { UserauthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private userauthService: UserauthService) { }

  loggedIn = false;
  ngOnInit(): void {
    if (this.userauthService.whetherLoggedIn()) {
      this.loggedIn = true;
    }
    else {
      this.loggedIn = false;
    }
  }

}
