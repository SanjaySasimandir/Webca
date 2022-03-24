import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserauthService } from '../services/userauth.service';

@Injectable({
  providedIn: 'root'
})
export class NotLoggedInGuard implements CanActivate {

  constructor(private userauthService: UserauthService, private router: Router) { }

  canActivate(): boolean {
    if (!this.userauthService.whetherLoggedIn()) {
      return true;
    }
    else {
      this.router.navigate(['']);
      return false;
    }
  }

}
