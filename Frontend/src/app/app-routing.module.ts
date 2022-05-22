import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotLoggedInGuard } from './guards/not-logged-in.guard';
import { InviteComponent } from './pages/invite/invite.component';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { RegisterComponent } from './pages/register/register.component';
import { VideoconfComponent } from './pages/videoconf/videoconf.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: MainComponent },
  { path: 'login', canActivate: [NotLoggedInGuard], component: LoginComponent },
  { path: 'signup', canActivate: [NotLoggedInGuard], component: RegisterComponent },
  { path: 'invite/:invitestring', canActivate: [AuthGuard], component: InviteComponent },
  { path: 'video/:roomid', canActivate: [AuthGuard], component: VideoconfComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
