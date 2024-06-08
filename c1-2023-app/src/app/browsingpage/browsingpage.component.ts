import { Component } from '@angular/core';
import { Card, CardList } from '../Card';
import { CardComponent } from '../card/card.component';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-browsingpage',
  templateUrl: './browsingpage.component.html',
  styleUrls: ['./browsingpage.component.scss'],
})

export class BrowsingpageComponent {
  trendar = false;
  prioriterat = false;
  nyaste = false;
  onDiscoverPage = true;
  planeraCards: Card[] = [];
  gorCards: Card[] = [];
  studeraCards: Card[] = [];
  ageraCards: Card[] = [];
  owner:any;

  card!: Card;
  cardList: CardList = [];

  userUnit: any;
  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      if (user && user.email) {
        const url = "http://127.0.0.1:8000/user/userfromemail";
        const data = {email: user.email}
        $.get(url, data, (result: any) => {
            //convert to User
            this.owner = {has_id: result.has_id,
            profession: result.profession,
            email: result.email,
            last_name: result.last_name,
            first_name: result.first_name,
            auth_lvl: result.auth_lvl,
            center: result.center.id,
            unit: result.unit.id,
            place: result.place.id}
            this.searchAllImprovementWork();
        })
      }
    });
  }
  
  toggleLine(tab: string): void {
      this.onDiscoverPage = (tab === 'discover');
    }

  showCard() {
    new CardComponent(this.card);
    this.cardList.push(this.card);
  }

  //Function to fill the arrays for the respective IW phases
  fillPdsa() {
  if (this.card.center == this.owner.center) {
     switch (this.card.pdsaTag) {
       case 'P':
         new CardComponent(this.card);
         this.planeraCards.push(this.card);
         break;
       case 'G':
        new CardComponent(this.card);
         this.gorCards.push(this.card);
         break;
       case 'S':
        new CardComponent(this.card);
         this.studeraCards.push(this.card);
         break;
       case 'A':
        new CardComponent(this.card);
         this.ageraCards.push(this.card);
         break;
       default:
         // Handles any unexpected tags
         break;
     }
    }
  }
  searchAllImprovementWork() {

    this.cardList = [];

    const url = "http://127.0.0.1:8000/Improvment/improvment_work";

    $.get(url, (result: any) => {
      for (var res of result) {
        if(res.published){
        console.log(res);
        this.card = {
          owner_id: res.responsible_user.has_id,
          owner: {
            auth_lvl: res.responsible_user.auth_lvl,
            first_name: res.responsible_user.first_name,
            last_name: res.responsible_user.last_name,
            profession: res.responsible_user.profession,
            has_id: res.responsible_user.has_id
          },
          center: res.responsible_user.center,
          unit: res.responsible_user.unit.name,
          id: res.id,
          title: res.name,
          department: res.department,
          description: res.description,
          pdsaTag: res.pdsa_tag,
          problem: res.problem, 
          how: res.how,
          ideas: res.ideas,
          how_goal: res.how_goal, 
          plan: res.plan,
          planned_time: res.planned_time,
          improvment: res.improvment,
          time: res.time,
          trends: res.trends,
          effects: res.effects,
          evaluate_changes: res.evaluate_changes, 
          teachings: res.teachings,
          evaluate_plan: res.evaluate_plan,
          improvment_plan: res.improvment_plan,
          evaluate_do: res.evaluate_do,
          next_step: res.next_step,
          spreading: res.spreading,
          maintain: res.maintain,
          future: res.future,
          archive: res.archive,
          archive_date: res.archive_date,
          goal: res.goal,
          numberOfComments: res.numberOfComments,
          numberOfLikes: res.numberOfLikes,
          created_at: res.created_at
        }
        
        //the list of cards that is shown under the "upptäck" tab
        this.showCard();
        //The kanban view with columns for pdsa status
        this.fillPdsa();
      }
    }
    });
  }
}
