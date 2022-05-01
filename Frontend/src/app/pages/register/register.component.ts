import { HttpClient } from '@angular/common/http';
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

  constructor(private router: Router, private userauthService: UserauthService, private http: HttpClient) { }

  usernamePage = true;
  usernameTaken = false;
  usernameLoginButtonDisabled = true;
  detailsPage = false;
  passwordPage = false;
  emailPage = false;
  emailTaken = false;
  termsBox = false;
  verifyButtonDisable = false;
  otpPage = false;
  otphint = false;
  signingupPage = false;
  regSuccess = false;

  hidePassword = true;


  username = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(16)]);
  fullname = new FormControl('', Validators.required);
  bio = new FormControl('', Validators.required);
  profilePicture = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
  otp = new FormControl('', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]);

  userNameFixer() {
    let value = this.username.value;
    value = value.toLowerCase();
    value = value.replace(/[^A-Z0-9]+/ig, "_");
    if (value[0] === "_") {
      value = value.substring(1);
    }
    this.username.setValue(value);
    this.duperUsernameCheck()
  }

  duperUsernameCheck() {
    this.usernameLoginButtonDisabled = true;
    this.userauthService.dupeUsernameCheck(this.username.value).subscribe(status => {
      if (status.message == "ok") {
        this.usernameTaken = false;
        this.usernameLoginButtonDisabled = false;
      }
      else if (status.message == "exists") {
        this.usernameTaken = true;
        this.username.setErrors({ 'incorrect': true })
      }
    });
  }

  openNamePage() {
    this.usernameLoginButtonDisabled = true;
    this.userauthService.dupeUsernameCheck(this.username.value).subscribe(status => {
      if (status.message == "ok") {
        this.usernameTaken = false;
        this.usernameLoginButtonDisabled = false;
        this.usernamePage = false;
        this.detailsPage = true;
      }
      else if (status.message == "exists") {
        this.username.setErrors({ 'incorrect': true })
        this.usernameTaken = true;
      }
    });
  }

  dupeEmailCheck() {
    this.verifyButtonDisable = true;
    this.userauthService.dupeEmailCheck(this.email.value).subscribe(status => {
      if (status.message == "exists") {
        this.email.setErrors({ 'incorrect': true })
        this.emailTaken = true;
        this.verifyButtonDisable = true;
      }
      else {
        this.verifyButtonDisable = false;
        this.emailTaken = false;
      }
    });
  }

  checkEmail() {
    this.verifyButtonDisable = true;
    this.userauthService.dupeEmailCheck(this.email.value).subscribe(status => {
      if (status.message == "exists") {
        this.email.setErrors({ 'incorrect': true })
        this.emailTaken = true;
        this.verifyButtonDisable = true;
      }
      else {
        this.verifyButtonDisable = false;
        this.emailPage = false;
        this.otpPage = true;
        this.sendOTP();
      }
    });
  }

  sendOTP() {
    this.userauthService.initiateMailVerification(this.email.value).subscribe(status => {
      return;
    });
  }

  uploadedFile: Array<File> = [];
  fileChange(element: any) {
    this.uploadedFile = element.target.files;
    console.log(this.uploadedFile[0]);
  }

  verifyOTP() {
    this.userauthService.verifyMailOtp(this.email.value, this.otp.value).subscribe(status => {
      if (status.message == "success") {
        this.signupUser();
      }
      else {
        this.otp.setErrors({ 'incorrect': true });
      }
    })
  }

  signupUser() {
    let user = new RegistrationModel(this.fullname.value, this.email.value, this.bio.value, this.username.value, this.password.value, '');
    this.userauthService.signup(user).subscribe(status => {
      if (status.message == "success") {
        this.otpPage = false;
        this.signingupPage = true;
        this.uploadPFP();
      }
    })
  }

  uploadPFP() {
    let formData = new FormData();
    formData.append("uploads[]", this.uploadedFile[0], this.username.value + '|&&&|' + this.uploadedFile[0].name);
    this.http.post(this.userauthService.server_address + 'users/uploadPFP', formData).subscribe((status: any) => {
      if (status.message == 'success') {
        this.signingupPage = false;
        this.regSuccess = true;
      }
    })
  }

  remainingTime = '';
  timerOn = false;

  timer(remaining: number) {
    let m = Math.floor(remaining / 60).toString();
    console.log(m)
    let s = (remaining % 60).toString();
    m = Number(m) < 10 ? '0' + m : m;
    s = Number(s) < 10 ? '0' + s : s;
    this.remainingTime = m + ':' + s;
    remaining--;

    if (remaining > 0 && this.timerOn) {
      setTimeout(() => {
        this.timer(remaining);
      }, 1000);
      return;
    }

    if (remaining == 0) {
      this.remainingTime = '';
      this.timerOn = false;
    }

    if (!this.timerOn) {
      this.remainingTime = ''
      return;
    }
  }

  ngOnInit(): void {
  }

  // uploadedFile: Array<File> = [];
  // fileChange(element: any) {
  //   this.uploadedFile = element.target.files;
  // }


}
