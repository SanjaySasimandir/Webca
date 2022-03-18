import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    console.log('here');
    this.userauthService.usernameUniquenessCheck(this.username.value);
  }

  loginRedirect() {
    this.router.navigate(['login']);
  }

  hide_password = true;
  username = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]);

  ngOnInit(): void {
  }

}
