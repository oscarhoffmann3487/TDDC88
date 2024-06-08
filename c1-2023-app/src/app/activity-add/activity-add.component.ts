import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-activity-add',
  templateUrl: './activity-add.component.html',
  styleUrls: ['./activity-add.component.scss']
})
export class ActivityAddComponent {

  priorities = ["Hög Prioritet", "Låg Priotitet"]
  prio: string = '';

  searchedUsers: any[]= [{
    id:0,
    name: ''
  }];
  searchName: string = '';

  @Input() title: string ='';
  @Input() description: string = '';
  @Input() displayPrio = "";
  @Input() pdsaTag: string = '';
  @Input() team = [{
    id:0,
    name: ''
  }]; 
  @Output() closeActivityOutput = new EventEmitter<void>();
  @Output() saveActivityOutput = new EventEmitter<{}>();

  constructor(private renderer: Renderer2, private elementRef: ElementRef){

  };
  
  closeActivity() {
    this.closeActivityOutput.emit();
    this.title ='';
    this.description = '';
    this.prio = '';
    this.displayPrio='';
    this.pdsaTag = '';
    this.team = [{
      id:0,
      name: ''
    }];
  }

  saveActivity(){
    if (!this.prio){
      this.setPrio()
    }
    let activity = {
      title: this.title,
      description: this.description,
      prio: this.prio,
      pdsaTag: this.pdsaTag,
      team : this.team
    };

    this.saveActivityOutput.emit(activity);
    if (this.prio){
      this.closeActivity();
      this.closeAddParticipant();
    }
  }

  setPrio(){
    if (this.displayPrio == "Hög Prioritet"){
      this.prio = 'h';
    }else if (this.displayPrio == "Låg Priotitet"){
      this.prio = 'l';
    }else{
      this.prio = '';
    }
  }

  removeParticipant(num: number){
    this.team.splice(num, 1);
  }

  openAddParticipant(){
    let element = this.elementRef.nativeElement.querySelector('#add-Participant-Activity');
    this.renderer.setStyle(element, 'display', 'flex');
  }

  closeAddParticipant(){
    let element = this.elementRef.nativeElement.querySelector('#add-Participant-Activity');
    this.renderer.setStyle(element, 'display', 'none');
  }

  searchUser(){
    this.searchedUsers = []

    let url = "http://127.0.0.1:8000/user/userName" + "?name=" + this.searchName

    $.get(url, (result: any,) => {

      if (result == "No name") {
        let element = document.getElementById("search-text-activity")
        if (element != null) {
          element.textContent = "Fyll i ett namn för att söka på personer"
        }
      } else if (result == "No match") {
        let element = document.getElementById("search-text-activity")
        if (element != null) {
          element.textContent = "Hittade ingen person på detta namn, är namnet rättstavat?"
        }
      } else {
        for (let res of result) {
          let user = {
            name: res.first_name + " " + res.last_name,
            id: res.has_id,
            center: res.center.name,
            unit: res.unit.name,
            place: res.place.name,
            email: res.email
          }
          this.searchedUsers.push(user)
        }
        let text = this.elementRef.nativeElement.querySelector('#serch-before-activity');
        this.renderer.setStyle(text, 'display', 'none');

        let res = this.elementRef.nativeElement.querySelector('#serch-after-activity');
        this.renderer.setStyle(res, 'display', 'block');
      }
    });
  }

  addParticipant(num: number) {
    console.log(this.team)
    console.log(this.searchedUsers[num])
    this.team.push(this.searchedUsers[num]);
    this.searchName = "";

    let element = document.getElementById("search-text-activity")
    if (element != null) {
      element.textContent = "Sök efter personer för att se resultat"
    }

    let text = this.elementRef.nativeElement.querySelector('#serch-before-activity');
    this.renderer.setStyle(text, 'display', 'block');

    let res = this.elementRef.nativeElement.querySelector('#serch-after-activity');
    this.renderer.setStyle(res, 'display', 'none');
  }

}
