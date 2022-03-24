import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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

  checkWhetherUniqueUsername() {
    this.userauthService.dupeUsernameCheck(this.username.value).subscribe(status => {
      if (status.message == "exists") {
        this.usernameTaken = true;
        this.username.setErrors({ 'duplicate': true });
        this.username.markAsTouched();
      }
      else {
        this.usernameTaken = false;
      }
    });
  }

  checkWhetherUniqueEmail() {
    this.userauthService.dupeEmailCheck(this.email.value).subscribe(status => {
      if (status.message == "exists") {
        this.emailTaken = true;
        this.email.setErrors({ 'duplicate': true });
        this.email.markAsTouched();

      }
      else {
        this.emailTaken = false;
      }
    });
  }

  loginRedirect() {
    this.router.navigate(['login']);
  }

  register() {
    let newuser = new RegistrationModel(this.username.value, this.fullname.value, this.email.value, this.password.value, Date.now().toString(), [], '')
    this.userauthService.signup(newuser).subscribe(status => {
      if (status.message === 'success') {
        this.loginRedirect();
      }
    })
  }

  hide_password = true;
  usernameTaken = false;
  emailTaken = false;
  username = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]);
  password = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]);
  fullname = new FormControl('', [Validators.required, Validators.maxLength(40)]);
  email = new FormControl('', [Validators.required, Validators.email, Validators.maxLength(25)]);
  otp = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]);



  ngOnInit(): void {
    // this.checkWhetherUniqueUsername();
    // this.checkWhetherUniqueEmail();
  }

}
