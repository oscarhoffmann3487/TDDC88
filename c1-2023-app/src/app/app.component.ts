import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'c1-2023-app';
  isAuthenticated = false;
  constructor(public auth: AuthService, public router: Router) {}

  // Adds a listener for authentication changes and redirects to login page
  // when user is unauthenticated.
  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe({
      next: (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        this.router.navigate(['/browsing']);
        if (!isAuthenticated) {
          this.auth.loginWithRedirect();
        }
      }
    })
  }
}