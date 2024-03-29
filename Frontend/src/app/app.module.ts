import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTreeModule } from '@angular/cdk/tree';
import { PortalModule } from '@angular/cdk/portal';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { ErrorStateMatcher, MatRippleModule, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { MatBadgeModule } from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDialogModule } from '@angular/material/dialog';

import { MainComponent } from './pages/main/main.component';
import { UserauthService } from './services/userauth.service';
import { ChatboxComponent } from './pages/dashboard/chatbox/chatbox.component';
import { AuthFooterComponent } from './pages/auth-footer/auth-footer.component';
import { HeaderComponent } from './pages/header/header.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GrouplistComponent } from './pages/dashboard/grouplist/grouplist.component';
import { ChannellistComponent } from './pages/dashboard/channellist/channellist.component';
import { CreateGroupComponent } from './pages/dashboard/grouplist/create-group/create-group.component';
import { AddChannelDialogComponent } from './pages/dashboard/channellist/add-channel-dialog/add-channel-dialog.component';
import { InviteComponent } from './pages/invite/invite.component';
import { NewMessageSnackBarComponent } from './pages/dashboard/grouplist/new-message-snack-bar/new-message-snack-bar.component';
import { VideoconfComponent } from './pages/videoconf/videoconf.component';
import { FilesComponent } from './pages/dashboard/files/files.component';
import { NewFolderDialogComponent } from './pages/dashboard/files/new-folder-dialog/new-folder-dialog.component';
import { VideoPlayerComponent } from './pages/videoconf/video-player/video-player.component';
import { WebSocketService } from './services/web-socket.service';
import { GroupService } from './services/group.service';
import { MediaService } from './services/video/media.service';
import { PeerService } from './services/video/peer.service';
import { FourZeroFourComponent } from './pages/four-zero-four/four-zero-four.component';
import { ViewmembersComponent } from './pages/dashboard/channellist/viewmembers/viewmembers.component';
import { AddMembersDialogComponent } from './pages/dashboard/add-members-dialog/add-members-dialog.component';

const materialModules = [
  CommonModule,
  CdkTreeModule,
  ClipboardModule,
  TextFieldModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatButtonToggleModule,
  MatTreeModule,
  OverlayModule,
  PortalModule,
  MatBadgeModule,
  MatGridListModule,
  MatRadioModule,
  MatDatepickerModule,
  MatTooltipModule,
  MatStepperModule,
  MatDialogModule,

];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    ChatboxComponent,
    AuthFooterComponent,
    HeaderComponent,
    DashboardComponent,
    GrouplistComponent,
    ChannellistComponent,
    CreateGroupComponent,
    AddChannelDialogComponent,
    InviteComponent,
    NewMessageSnackBarComponent,
    VideoconfComponent,
    FilesComponent,
    NewFolderDialogComponent,
    VideoPlayerComponent,
    FourZeroFourComponent,
    ViewmembersComponent,
    AddMembersDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    materialModules
  ],
  providers: [UserauthService, WebSocketService, GroupService, PeerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
