import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss']
})

export class LoginButtonComponent {
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) { }
}
