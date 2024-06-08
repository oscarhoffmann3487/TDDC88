import { Component, Input } from '@angular/core';
import { Card, CardList } from '../Card'
import { CardComponent } from '../card/card.component';
import { AuthService } from '@auth0/auth0-angular';
import { CardItemComponent } from '../card-item/card-item.component';
import { ActivitiesComponent } from '../create/activities/activities.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  onActivities = false;
  onMyIW = true;
  onFollowedIW = false;

  planeraCards: Card[] = [];
  gorCards: Card[] = [];
  studeraCards: Card[] = [];
  ageraCards: Card[] = [];
  owner:any;

  card!: Card;
  cardListMyIW: CardList = [];
  cardListFollowedIW: CardList = [];

  activity: any;
  activities: any[] = [];

  userUnit: any;
  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      if (user && user.email) {
        const url = "http://127.0.0.1:8000/user/userfromemail";
        const data = {email: user.email}
        $.get(url, data, (result: any) => {
            //convert to User
            this.owner = {
              has_id: result.has_id,
              profession: result.profession,
              email: result.email,
              last_name: result.last_name,
              first_name: result.first_name,
              auth_lvl: result.auth_lvl,
              center: result.center.id,
              unit: result.unit.id,
              place: result.place.id,
              center_name: result.center.name,
              unit_name: result.unit.name,
              place_name: result.place.name
            }
            this.searchMyImprovmentWorks();
            this.searchFollowedImprovmentWorks();
            this.myActivities();
        })
      }
    });
  }

  toggleLine(tab: string): void {
    this.onActivities = (tab === 'activities');
    this.onMyIW = (tab === 'myIW');
    this.onFollowedIW = (tab === 'followedIW');
  }

  
  myActivities() {

    this.cardListFollowedIW = [];

    const url = "http://127.0.0.1:8000/Improvment/activitiesByUserId";

    let data = {
      id: this.owner.has_id,
    };

    $.get(url, data, (result: any) => {
      for (var res of result) {
        this.activities.push(res.activity);

        console.log("RESULT:", res.activity); 
      }

    })
  }
  

  searchFollowedImprovmentWorks() {

    this.cardListFollowedIW = [];

    const url = "http://127.0.0.1:8000/Improvment/likedImprov";

    let data = {
      has_id: this.owner.has_id,
    };

    $.get(url, data, (result: any) => {
      for (var res of result) {
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
        new CardComponent(this.card);
        this.cardListFollowedIW.push(this.card);
      
       
      }
    })

  }

  searchMyImprovmentWorks() {

    this.cardListMyIW = [];

    const url = "http://127.0.0.1:8000/Improvment/ownerImprovmentWork";

    let data = {
      has_id: this.owner.has_id,
    };

    $.get(url, data, (result: any) => {
      for (var res of result) {

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
        new CardComponent(this.card);
        this.cardListMyIW.push(this.card);
       
      }
    })
  }

  edit(index:number){
    if(this.activities[index].finished){
      this.activities[index].finished = false;
    } else {
      this.activities[index].finished = true;
    }

    let url =" http://127.0.0.1:8000/Improvment/updateActivity/"+ this.activities[index].id + "/"
    console.log( this.activities[index])
    let updatedActivity={
      "id": this.activities[index].id,
      "title": this.activities[index].title,
      "description": this.activities[index].description,
      "priority_level": this.activities[index].priority_level,
      "pdsa_tag": this.activities[index].pdsa_tag,
      "finished": this.activities[index].finished, 
      "Improvment_work": this.activities[index].Improvment_work

    }
    $.ajax({
      url: url,
      type: "PUT",
      data: JSON.stringify(updatedActivity),
      dataType: "json",
      contentType: "application/json"
    });
  }

}