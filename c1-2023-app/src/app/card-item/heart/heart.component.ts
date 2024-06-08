import { Component, Input } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-heart',
  templateUrl: './heart.component.html',
  styleUrls: ['./heart.component.scss']
})
export class HeartComponent {
  followed_svg = "assets/improvement-work/heart_1.svg"; //'<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 43 39" fill="none"><path d="M5.11701 5.07826L5.10719 5.08782L5.0975 5.0975C3.22046 6.97455 2 9.5581 2 12.5143C2 15.4371 3.22687 18.0088 5.07826 19.9116L5.08782 19.9214L5.0975 19.9311L19.6144 34.4479L21.0286 35.8622L22.4428 34.4479L36.9597 19.9311C38.8367 18.054 40.0572 15.4705 40.0572 12.5143C40.0572 9.59146 38.8303 7.01983 36.9789 5.11701L36.9693 5.10719L36.9597 5.0975C35.0826 3.22046 32.4991 2 29.5429 2C26.62 2 24.0484 3.22687 22.1456 5.07826L22.1358 5.08782L22.1261 5.0975C21.726 5.49756 21.3558 5.92971 21.0208 6.39072C20.6948 5.93903 20.3361 5.5135 19.9503 5.11701L19.9408 5.10719L19.9311 5.0975C18.054 3.22046 15.4705 2 12.5143 2C9.59146 2 7.01983 3.22687 5.11701 5.07826Z" fill="#BC335C" stroke="#DEC3CB" stroke-width="4"/></svg>';
  not_followed_svg = "assets/improvement-work/heart_0.svg"; //'<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 43 39" fill="none"><path d="M5.11701 5.07826L5.10719 5.08782L5.0975 5.0975C3.22046 6.97455 2 9.5581 2 12.5143C2 15.4371 3.22687 18.0088 5.07826 19.9116L5.08782 19.9214L5.0975 19.9311L19.6144 34.4479L21.0286 35.8622L22.4428 34.4479L36.9597 19.9311C38.8367 18.054 40.0572 15.4705 40.0572 12.5143C40.0572 9.59146 38.8303 7.01983 36.9789 5.11701L36.9693 5.10719L36.9597 5.0975C35.0826 3.22046 32.4991 2 29.5429 2C26.62 2 24.0484 3.22687 22.1456 5.07826L22.1358 5.08782L22.1261 5.0975C21.726 5.49756 21.3558 5.92971 21.0208 6.39072C20.6948 5.93903 20.3361 5.5135 19.9503 5.11701L19.9408 5.10719L19.9311 5.0975C18.054 3.22046 15.4705 2 12.5143 2C9.59146 2 7.01983 3.22687 5.11701 5.07826Z" fill="#F1F1F1" stroke="#DCDCDC" stroke-width="4"/></svg>';
  current_svg = this.not_followed_svg;
  
  liked: boolean;
  current_user: any;
  user_subscription: any;

  @Input() number_of_likes: any;
  @Input() iw_id: any;
  constructor(public auth: AuthService, private sanitizer: DomSanitizer) {
    // Icons and liked status set to "not liked" after initialization
    this.current_svg = this.not_followed_svg; //this.sanitizer.bypassSecurityTrustHtml(this.not_followed_svg);
    this.liked = false;
  };

  ngOnInit(): void {
    // Get logged in user to check who liked the improvement work
    this.user_subscription= this.auth.user$.subscribe((user) => {
      if (user && user.email) {
        const url_user = "http://127.0.0.1:8000/user/userfromemail";
        const data_user = {email: user.email}
        $.get(url_user, data_user, (result: any) => {
            this.current_user = {has_id: result.has_id,
            profession: result.profession,
            email: result.email,
            last_name: result.last_name,
            first_name: result.first_name,
            auth_lvl: result.auth_lvl,
            center: result.center.id,
            unit: result.unit.id,
            place: result.place.id}

            // Check if user has already liked the IW           
            const url_like = "http://127.0.0.1:8000/Improvment/like";
            const data_like = {improvement_work: this.iw_id, has_id: this.current_user.has_id};
            $.get(url_like, data_like, (result: any) => {
              if (result.message == true) {
                // Set front-end attributes to "liked-status"
                this.liked = true;
                this.current_svg = this.followed_svg;
                //this.current_icon = this.filled_icon;
                //this.current_id = this.filled_id;
              }
            })
            
        })
        
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to user subscription to prevent memory leaks
    this.user_subscription.unsubscribe();
  }
  
  currentSVG() : HTMLElement {
    return document.createElement('div');
    //return (this.liked) ? this.followed_svg : this.not_followed_svg;
  }

  // Called when the heart is clicked in the UI,
  // Changes liked property and increases/decreases number_of_likes for
  // front-end functionality
  clickHeart() {
    //console.log('')
    if (this.current_user && this.current_user.has_id) {
      const url_like = "http://127.0.0.1:8000/Improvment/like";
      const data_like = {improvement_work: this.iw_id, has_id: this.current_user.has_id};
      $.post(url_like, data_like, (result: any) => {
        if (result.likes_count > this.number_of_likes) {
          // Set front-end attributes to "liked-status"
          this.liked = true;
          this.number_of_likes = result.likes_count;
          this.current_svg = this.followed_svg; //this.sanitizer.bypassSecurityTrustHtml(this.followed_svg);
        } else if (result.likes_count < this.number_of_likes) {
          // Set front-end attributes to "not liked-status"
          this.liked = false;
          this.number_of_likes = result.likes_count;
          this.current_svg = this.not_followed_svg; //this.sanitizer.bypassSecurityTrustHtml(this.not_followed_svg);
        }
      })
    } 
  }
}
