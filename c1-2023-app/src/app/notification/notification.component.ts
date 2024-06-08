import { Component, ViewChild, AfterViewInit, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { AuthService } from '@auth0/auth0-angular';
import { ConditionalExpr } from '@angular/compiler';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  @Input() showNotifications = false;
  @Output() cancelEvent = new EventEmitter<void>();

  constructor(public auth: AuthService, private el: ElementRef) {  }

  closeNotifications(): void {
    this.cancelEvent.emit();
  }

 // Declare myArray as a member of the class
 notifications: { notification_content: string; date: string; read: boolean }[] = [];
  user_data: any;

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      if (user && user.email) {
        let url = "http://127.0.0.1:8000/user/userfromemail";
        const data = { email: user.email }
        $.get(url, data, (result: any) => {
          this.user_data = {
            id: result.has_id,
          }

          url = "http://127.0.0.1:8000/user/iwNotification";
          $.get(url, this.user_data, (result: any) => {
            this.notifications = result;
            for (const notification of this.notifications) {
              const date = new Date(notification.date);
              const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
              notification.date = formattedDate;
              const content = notification.notification_content;
              const indexOfAngaende = content.indexOf('angående');
              if (indexOfAngaende !== -1) {
                const boldText = `<strong>${content.substring(indexOfAngaende + 'angående'.length)}</strong>`;
                notification.notification_content = `${content.substring(0, indexOfAngaende)}angående${boldText}`;
              }
            }
            console.log(this.notifications);
          })

          url = "http://127.0.0.1:8000/user/iwNotification";
          $.ajax({
            url: url,
            type: "PUT",
            data: JSON.stringify(this.user_data),
            dataType: "json",
            contentType: "application/json"
          });
        })
      }
    });
  }
}
