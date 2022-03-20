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

  username = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(12)]);
  password = new FormControl('', [Validators.required]);

  registerRedirect() {
    this.router.navigate(['signup']);
  }

  ngOnInit(): void {
  }

}
