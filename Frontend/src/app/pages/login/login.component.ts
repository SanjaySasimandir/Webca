import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserauthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private userauthService: UserauthService) { }

  hide_password = true;
  invalid_credentials = false;

  username = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]);
  password = new FormControl('', [Validators.required]);

  login() {
    this.userauthService.login({ "username": this.username.value, "password": this.password.value }).subscribe(status => {
      if (status.message === "success") {
        this.invalid_credentials = false;
        localStorage.setItem('token', JSON.stringify(status.token));
        this.router.navigate(['']);
      }
      else {
        this.invalid_credentials = true;
      }
    });
  }

  registerRedirect() {
    this.router.navigate(['signup']);
  }

  ngOnInit(): void {
  }

}
