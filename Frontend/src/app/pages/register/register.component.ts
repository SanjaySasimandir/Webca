import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationModel } from 'src/app/models/registration.model';
import { UserauthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router, private userauthService: UserauthService) { }

  // Check whether username is unique
  checkWhetherUniqueUsername() {
    this.userauthService.dupeUsernameCheck(this.username.value).subscribe(status => {
      if (status.message == "exists") {
        this.usernameTaken = true;
      }
      else {
        this.usernameTaken = false;
      }
    });
  }

  loginRedirect() {
    this.router.navigate(['login']);
  }

  register() {
    let newuser = new RegistrationModel(this.username.value, this.fullname.value, this.password.value, this.email.value, Date.now().toString(),[],'')
    this.userauthService.signup(newuser).subscribe(status => {
      if (status.message === 'success') {
        this.loginRedirect();
      }
    })
  }

  hide_password = true;
  usernameTaken = false;
  username = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]);
  password = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]);
  fullname = new FormControl('', [Validators.required, Validators.maxLength(40)]);
  email = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(25)]);
  

  ngOnInit(): void {
  }

}
