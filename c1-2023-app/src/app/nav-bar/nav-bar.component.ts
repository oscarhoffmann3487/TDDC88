import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) {}

  searchWord = "";
  showNotification: boolean = false;

  ngOnInit(): void {
  }

  showNotifications(): void {
    if(this.showNotification) {
          this.showNotification = false;
        } else {
          this.showNotification = true;
        }
  }
  
  closeNotifications(): void {
    this.showNotification = false;
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

}