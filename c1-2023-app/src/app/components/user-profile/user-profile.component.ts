import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-user-profile',
  template: ''
})

export class UserProfileComponent {
  constructor(public auth: AuthService) {}
}