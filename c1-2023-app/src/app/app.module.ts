import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { SharedService } from './shared.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowsingpageComponent } from './browsingpage/browsingpage.component';
import { IwmodalComponent } from './browsingpage/iwmodal/iwmodal.component';
import { CardComponent } from './card/card.component';
import { CardItemComponent } from './card-item/card-item.component';
import { SmallcardComponent } from './smallcard/smallcard.component';
// Angular Materials
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginButtonComponent } from './components/login-button/login-button.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthModule } from '@auth0/auth0-angular';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { CreateComponent } from './create/create.component';
import { SearchComponent } from './search/search.component';
import { InputBoxComponent } from './input-box/input-box.component';
import { ActivitiesComponent } from './create/activities/activities.component';

import { Card } from './Card';
import { TeamMatesComponent } from './team-mates/team-mates.component';
import { SearchedUserComponent } from './searched-user/searched-user.component';
import { HeartComponent } from './card-item/heart/heart.component';
import { ConfirmationDialogComponent } from './create/confirmation-dialog/confirmation-dialog.component';
import { AboutComponent } from './about/about.component';
import { NotificationComponent } from './notification/notification.component';
import { ActivityAddComponent } from './activity-add/activity-add.component';
@NgModule({
  declarations: [AppComponent,
    LoginButtonComponent,
    PlaceholderComponent,
    NavBarComponent,
    HomeComponent,
    UserProfileComponent,
    PlaceholderComponent,
    CardComponent,
    CardItemComponent,
    BrowsingpageComponent,
    SearchComponent,
    CreateComponent,
    InputBoxComponent,
    ActivitiesComponent,
    TeamMatesComponent,
    SearchedUserComponent,
    HeartComponent,
    SmallcardComponent,
    ConfirmationDialogComponent,
    AboutComponent,
    NotificationComponent,
    ActivityAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCheckboxModule,
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'dev-j5muoaraf1qicg4g.us.auth0.com',
      clientId: 'ttgY7QGUA8r6A5FR7tvH0QiEoxvH48uz',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
  ],

  providers: [SharedService,
    { provide: 'CardToken', useValue: {} as Card }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

