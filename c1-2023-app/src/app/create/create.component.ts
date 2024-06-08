import { Component, ElementRef, Renderer2 } from '@angular/core';
import { async } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})

export class CreateComponent {
  //  textValue = 'Titel';
  isEditMode = false;
  //phase = "plan";
  planPhaseBackgroundColor = "#182745";
  planPhaseTextColor = "#FFFFFF";
  doAtivePhaseBackgroundColor = "#BDD2FB";
  doActivePhaseTextColor = "#45475F";
  studyPhaseBackgroundColor = "#BDD2FB";
  studyPhaseTextColor = "#45475F";
  actAtivePhaseBackgroundColor = "#BDD2FB";
  actActivePhaseTextColor = "#45475F";
  display_status = "Plan";
  progress: string = 'assets/improvement-work/PlanPhase.png';
  //Empty data_fields
  title: string = '';
  description: string = '';
  pdsa_tag: string = 'P';
  upvotes: number  = 0;
  problem: string = '';
  goal: string = '';
  how: string = '';
  ideas: string = '';
  how_goal: string = '';
  plan: string = '';
  planned_time: string = '';
  improvment: string = '';
  time: string = '';
  trends: string = '';
  effects: string = '';
  evaluate_changes: string = '';
  teachings: string = '';
  evaluate_plan: string = '';
  improvment_plan: string = '';
  evaluate_do: string = '';
  next_step: string = '';
  spreading: string = '';
  maintain: string = '';
  future: string = '';
  archive: string = '';
  archive_date: string = '';
  tabphase: string = "Plan";

  //selected center,place,unit Välj xxx om auth inte matchar med email i db
  center = { id: 1, name: "Välj centrum" };
  unit = { id: 1, name: "Välj klinik/enhet" };
  place = { id: 1, name: "Välj plats" };
  owner: any;
  //all centers,places,units
  centers: any;
  units: any;
  places: any;
  //dropdown for center, unit, places
  activeDropdown: string | null = null;
  //Activities veribles
  activityTitle = ""
  activityDescription: string = '';
  activityPrio: string = '';
  activityStatus: boolean = false;
  activityPrioText: string = '';
  newActivity: boolean = false;
  activityTeam = [];
  activeIndex: number = 1;
  activityPdsaTag: string = 'P';


  activities: any[] = [];

  showArchiveContainer: boolean = false;
  //for compulsory fields warning
  showHelpContainer: boolean = false;
  highlight_compulsory_fields: boolean = false;

  //Teams
  team: any[] = [];
  searchedUsers: any[] = [];
  searchName: string = '';
  
  
  //improvement work id received if edit iw
  iw_id: any;
  editingIw: boolean = false;

  //Notifications
  notification_team: any[] = [];

  constructor(private renderer: Renderer2, private elementRef: ElementRef, public auth: AuthService, private router: Router, private route: ActivatedRoute) {
    // Calculate the height (for example, 200 pixels)
    this.componentHeight = 105;
    // Data if in edit mode
    this.route.params.subscribe(params => {
      this.iw_id = params['id'];
      if (this.iw_id) {
        this.editIw()
      }
    });
  }

  componentHeight: number;

  ngOnInit() {
    //get units, places, centers
    $.get("http://127.0.0.1:8000/user/center", (result: any) => {
      this.centers = result
    })

    $.get("http://127.0.0.1:8000/user/place", (result: any) => {
      this.places = result
    })

    $.get("http://127.0.0.1:8000/user/unit", (result: any) => {
      this.units = result
    })

    //Get user email from auth0
    this.auth.user$.subscribe((user) => {
      if (user && user.email) {
        const url = "http://127.0.0.1:8000/user/userfromemail";
        const data = { email: user.email }
        $.get(url, data, (result: any) => {
          this.center = result.center;
          this.unit = result.unit;
          this.place = result.place;
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
            place: result.place.id
          }
        })
      }
    });
  }

  // Open the first tab by default
  ngAfterViewInit() {
    const defaultOpenTab = document.querySelector('#defaultOpen');
    if (defaultOpenTab) {
      const event = new Event('click') as any;  // Use 'as any' to bypass TypeScript strict checks
      Object.defineProperty(event, 'currentTarget', { value: defaultOpenTab });
      this.openTab(event, 'Plan');
    }
  }

  openTab(event: Event, phase: string): void {
    // Declare all variables
    const tabcontent = document.querySelectorAll('.tabcontent') as NodeListOf<HTMLElement>;
    const tablinks = document.querySelectorAll('.tablinks') as NodeListOf<HTMLElement>;
    this.tabphase = phase;
    // Get all elements with class="tabcontent" and hide them
    tabcontent.forEach((tab) => {
      tab.style.display = 'none';
    });

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks.forEach((tablink) => {
      tablink.classList.remove('active');
    });

    // Show the current tab, and add an "active" class to the button that opened the tab
    const currentTab = document.getElementById(phase);
    if (currentTab) {
      currentTab.style.display = currentTab.style.display === 'none' ? 'block' : 'none';
    }

    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.classList.add('active');
    }
    this.display_status = phase;
    this.setAcrivityPdsa(phase);
  }

  setAcrivityPdsa(name: String){
    if (name == "Plan"){
      this.activityPdsaTag = 'P';
    }else if (name == "Do"){
      this.activityPdsaTag = 'D';
    }else if (name == "Study"){
      this.activityPdsaTag = 'S';
    }else if (name == "Act"){
      this.activityPdsaTag = 'A';
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  //unit, center, place dropdown menus 
  toggleDropdown(dropdown: string) {
    this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
  }

  changeCenter(selectedCenter: any) {
    this.center = selectedCenter;
    this.activeDropdown = null;
  }

  changePlace(selectedPlace: any) {
    this.place = selectedPlace;
    this.activeDropdown = null;
  }

  changeUnit(selectedUnit: any) {
    this.unit = selectedUnit;
    this.activeDropdown = null;
  }

  showConfirmationArchive(){
    this.showArchiveContainer = !this.showArchiveContainer;
  }

  //---------------Activity---------------------------------
  showcurrentActivities(){

  }
  
  openAddActivity() {
    this.openActivity();
    this.newActivity = true; 
  }

  openActivity() {
    if (this.display_status == "Plan"){
      let element = this.elementRef.nativeElement.querySelector('#add-acttivty-container-plan');
      this.renderer.setStyle(element, 'display', 'block');
    }else if(this.display_status == "Do"){
      let element = this.elementRef.nativeElement.querySelector('#add-acttivty-container-do');
      this.renderer.setStyle(element, 'display', 'block');
    }else if(this.display_status == "Study"){
      let element = this.elementRef.nativeElement.querySelector('#add-acttivty-container-study');
      this.renderer.setStyle(element, 'display', 'block');
    }else if(this.display_status == "Act"){
      let element = this.elementRef.nativeElement.querySelector('#add-acttivty-container-act');
      this.renderer.setStyle(element, 'display', 'block');
    }
  }


  deleteActivity(index: number) {
    this.activities.splice(index, 1);
  }

  changeActivityStatus(index: number){
    if(this.activities[index].finished){
      this.activities[index].finished = false;
    } else {
      this.activities[index].finished = true;
    }
  }

  editActivity(index: number) {
    let activeActicty = this.activities[index]
    this.activityTitle = activeActicty.title;
    this.activityDescription = activeActicty.description;
    this.activityPrio = activeActicty.priority_level;
    this.activityStatus = activeActicty.finished;
    if (activeActicty.assignees){
      this.activityTeam = activeActicty.assignees.map((a: { has_id: any; first_name: string; last_name: string; }) => ({ id: a.has_id, name: a.first_name + " " + a.last_name }));
    }else{
      this.activityTeam = activeActicty.responsible_users
      ;
    }
    this.setPrio();
    this.openActivity();
    console.log(activeActicty.priority_level)

    this.activeIndex = index

  }

  closeActivity() {
    if (this.display_status == "Plan"){
      let element = this.elementRef.nativeElement.querySelector('#add-acttivty-container-plan');
      this.renderer.setStyle(element, 'display', 'none');
    }else if(this.display_status == "Do"){
      let element = this.elementRef.nativeElement.querySelector('#add-acttivty-container-do');
      this.renderer.setStyle(element, 'display', 'none');
    }else if(this.display_status == "Study"){
      let element = this.elementRef.nativeElement.querySelector('#add-acttivty-container-study');
      this.renderer.setStyle(element, 'display', 'none');
    }else if(this.display_status == "Act"){
      let element = this.elementRef.nativeElement.querySelector('#add-acttivty-container-act');
      this.renderer.setStyle(element, 'display', 'none');
    }

    this.activityTitle = "";
    this.activityDescription = '';
    this.activityPrio = '';
    this.activityStatus = false;
    this.newActivity = false;
    this.activityTeam = [];
  }

  setPrio() {
    if (this.activityPrio == 'h') {
      this.activityPrioText = "Hög Prioritet"
    } else if (this.activityPrio == 'l') {
      this.activityPrioText = "Låg Priotitet"
    }
    console.log(this.activityPrioText);
    console.log(this.activityPrio)

  }

  saveActivity(activity: any) {
    let savingActivity ={
    title: activity.title,
    description: activity.description,
    priority_level: activity.prio,
    pdsa_tag: this.activityPdsaTag,
    responsible_users: activity.team,
    finished: this.activityStatus
   } 

   this.activityPrio = activity.prio
  
    if (activity.prio != '') {
      console.log(this.newActivity)
      if (this.newActivity) {
        console.log("hello")
        this.activities.push(savingActivity);
      } else {
        this.activities[this.activeIndex] = savingActivity;
      }
      this.closeActivity()
    } else {
      alert("Var snäll att välj prio på din aktivitet")
    }
  }

  changestatus(phase: string) {
    if (phase == "plan") {
      this.planPhaseBackgroundColor = "#182745";
      this.planPhaseTextColor = "#FFFFFF";
      this.doAtivePhaseBackgroundColor = "#BDD2FB";
      this.doActivePhaseTextColor = "#45475F";
      this.studyPhaseBackgroundColor = "#BDD2FB";
      this.studyPhaseTextColor = "#45475F";
      this.actAtivePhaseBackgroundColor = "#BDD2FB";
      this.actActivePhaseTextColor = "#45475F";
      this.progress = 'assets/improvement-work/PlanPhase.png';
      this.pdsa_tag = "P";
    } else if (phase == "do") {
      this.planPhaseBackgroundColor = "#BDD2FB";
      this.planPhaseTextColor = "#45475F";
      this.doAtivePhaseBackgroundColor = "#182745";
      this.doActivePhaseTextColor = "#FFFFFF";
      this.studyPhaseBackgroundColor = "#BDD2FB";
      this.studyPhaseTextColor = "#45475F";
      this.actAtivePhaseBackgroundColor = "#BDD2FB";
      this.actActivePhaseTextColor = "#45475F";
      this.progress = 'assets/improvement-work/DoPhase.png';
      this.pdsa_tag = "G";
    }else if (phase == "study") {
      this.planPhaseBackgroundColor = "#BDD2FB";
      this.planPhaseTextColor = "#45475F";
      this.doAtivePhaseBackgroundColor = "#BDD2FB";
      this.doActivePhaseTextColor = "#45475F";
      this.studyPhaseBackgroundColor = "#182745";
      this.studyPhaseTextColor = "#FFFFFF";
      this.actAtivePhaseBackgroundColor = "#BDD2FB";
      this.actActivePhaseTextColor = "#45475F";
      this.progress = 'assets/improvement-work/StudyPhase.png';
      this.pdsa_tag = "S";
    } else if (phase == "act") {
      this.planPhaseBackgroundColor = "#BDD2FB";
      this.planPhaseTextColor = "#45475F";
      this.doAtivePhaseBackgroundColor = "#BDD2FB";
      this.doActivePhaseTextColor = "#45475F";
      this.studyPhaseBackgroundColor = "#BDD2FB";
      this.studyPhaseTextColor = "#45475F";
      this.actAtivePhaseBackgroundColor = "#182745";
      this.actActivePhaseTextColor = "#FFFFFF";
      this.progress = 'assets/improvement-work/ActPhase.png';
      this.pdsa_tag = "A";
    }
  }

  //---------------team--------------------------

  removeParticipant(num: number) {
    this.team.splice(num, 1);
  }

  openAddParticipant() {
    let element = this.elementRef.nativeElement.querySelector('#addParticipant');
    this.renderer.setStyle(element, 'display', 'flex');
  }

  closeAddParticipant() {
    let element = this.elementRef.nativeElement.querySelector('#addParticipant');
    this.renderer.setStyle(element, 'display', 'none');
  }

  addParticipant(num: number) {
    console.log(this.team)
    this.team.push(this.searchedUsers[num]);
    let notification_team_member = {
      id: this.searchedUsers[num].id
    }
    this.notification_team.push(notification_team_member);

    this.searchName = "";

    let element = document.getElementById("search-text")
    if (element != null) {
      element.textContent = "Sök efter personer för att se resultat"
    }

    let text = this.elementRef.nativeElement.querySelector('#serch-before');
    this.renderer.setStyle(text, 'display', 'block');

    let res = this.elementRef.nativeElement.querySelector('#serch-after');
    this.renderer.setStyle(res, 'display', 'none');
  }



  searchUser() {
    this.searchedUsers = []

    let url = "http://127.0.0.1:8000/user/userName" + "?name=" + this.searchName

    $.get(url, (result: any,) => {

      if (result == "No name") {
        let element = document.getElementById("search-text")
        if (element != null) {
          element.textContent = "Fyll i ett namn för att söka på personer"
        }
      } else if (result == "No match") {
        let element = document.getElementById("search-text")
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
        let text = this.elementRef.nativeElement.querySelector('#serch-before');
        this.renderer.setStyle(text, 'display', 'none');

        let res = this.elementRef.nativeElement.querySelector('#serch-after');
        this.renderer.setStyle(res, 'display', 'block');
      }



    });


  }
  //---------------------------------------------------

  closePublishHelpContainer(){
    this.showHelpContainer = false;
  }

  postIW() {
    const url = "http://127.0.0.1:8000/Improvment/improvment_work";
    
    let newIW = {
      name: this.title.length > 0 ? this.title : null,
      description: this.description.length > 0 ? this.description : null,
      pdsa_tag: this.pdsa_tag,
      upvotes: this.upvotes,
      problem: this.problem.length > 0 ? this.problem: null,
      goal: this.goal.length > 0 ? this.goal: null,
      how: this.how.length > 0 ? this.how: null,
      ideas: this.ideas.length > 0 ? this.ideas: null,
      how_goal: this.how_goal.length > 0 ? this.how_goal: null,
      plan: this.plan.length > 0 ? this.plan: null,
      planned_time: this.planned_time.length > 0 ? this.planned_time: null,
      improvment: this.improvment.length > 0 ? this.improvment: null,
      time: this.time.length > 0 ? this.time: null,
      trends: this.trends.length > 0 ? this.trends: null,
      effects: this.effects.length > 0 ? this.effects: null,
      evaluate_changes: this.evaluate_changes.length > 0 ? this.evaluate_changes: null,
      teachings: this.teachings.length > 0 ? this.teachings: null,
      evaluate_plan: this.evaluate_plan.length > 0 ? this.evaluate_plan: null,
      improvment_plan: this.improvment_plan.length > 0 ? this.improvment_plan: null,
      evaluate_do: this.evaluate_do.length > 0 ? this.evaluate_do: null,
      next_step: this.next_step.length > 0 ? this.next_step: null,
      spreading: this.spreading.length > 0 ? this.spreading: null,
      maintain: this.maintain.length > 0 ? this.maintain: null,
      future: this.future.length > 0 ? this.future: null,
      archive: this.archive.length > 0 ? this.archive: null,
      archive_date: this.archive_date.length > 0 ? this.archive_date: null,
      finished: "false",
      published: "true",
      responsible_user: this.owner.has_id, 
      activities : this.activities,
      team : this.team
    };

    if(newIW.name == null || newIW.description == null || newIW.problem == null || newIW.goal == null || newIW.how == null ||
      newIW.plan == null || newIW.planned_time == null || newIW.evaluate_changes == null || newIW.ideas == null || newIW.how_goal == null){
      this.showHelpContainer = true;
      this.highlight_compulsory_fields = true;
    } else {
      $.ajax({
        url:url,
        type:"POST",
        data: JSON.stringify(newIW),
        dataType:"json",
        contentType: "application/json"
      });
      this.addUserNotification()
      this.addActivityNotification();
      this.router.navigate(['/browsing']);
    }
  }

  showConfirmationDialogPublish = false;
  showConfirmationDialogSave = false;
  confirmationTextPublish = 'Är du säker på att du vill publicera förändringsarbetet?';
  confirmationTextSave = 'Är du säker på att du vill spara en draft för förändringsarbetet?';

  showConfirmationPublish() {
    this.showConfirmationDialogPublish = true;
  }

  showConfirmationSave() {
    this.showConfirmationDialogSave = true;
  }

  confirmPostPublish() {
    this.postIW();
    this.showConfirmationDialogPublish = false;
  }

  confirmPostSave() {
    this.saveIW();
    this.showConfirmationDialogSave = false;
    this.router.navigate(['/about']);
  }

  cancelPost() {
    this.showConfirmationDialogPublish = false;
    this.showConfirmationDialogSave = false;
  }

  confirmPostSaveChanges() {
    this.putIW();
    this.showConfirmationDialogPublish = false;
    this.router.navigate(['/browsing']);
  }

  archiveIW() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth()+1;
    const day = currentDate.getDate();
    const date = year+"-"+month+"-"+day;
    this.archive_date = date;
    this.showArchiveContainer = !this.showArchiveContainer;
    let url = "http://127.0.0.1:8000/Improvment/improvment_work/" + this.iw_id + "/";
    let iw = {
      name: this.title.length > 0 ? this.title : null,
      description: this.description.length > 0 ? this.description : null,
      pdsa_tag: this.pdsa_tag,
      upvotes: this.upvotes,
      problem: this.problem.length > 0 ? this.problem: null,
      goal: this.goal.length > 0 ? this.goal: null,
      how: this.how.length > 0 ? this.how: null,
      ideas: this.ideas.length > 0 ? this.ideas: null,
      how_goal: this.how_goal.length > 0 ? this.how_goal: null,
      plan: this.plan.length > 0 ? this.plan: null,
      planned_time: this.planned_time.length > 0 ? this.planned_time: null,
      evaluate_changes: this.evaluate_changes.length > 0 ? this.evaluate_changes: null,
      teachings: this.teachings.length > 0 ? this.teachings: null,
      next_step: this.next_step.length > 0 ? this.next_step: null,
      spreading: this.spreading.length > 0 ? this.spreading: null,
      maintain: this.maintain.length > 0 ? this.maintain: null,
      future: this.future.length > 0 ? this.future: null,
      archive: this.archive.length > 0 ? this.archive: null,
      archive_date: this.archive_date.length > 0 ? this.archive_date: null,
      finished: "true", 
      responsible_user: this.owner.has_id, 
      activities : this.activities,
      team : this.team
    };
    $.ajax({
      url: url,
      type: "PUT",
      data: JSON.stringify(iw),
      dataType: "json",
      contentType: "application/json"
    });
    this.router.navigate(['/about']);
  }

  editIw() {
    this.editingIw = true;

    let urlIw = "http://127.0.0.1:8000/Improvment/idImprovmentWork";
    const data = {id : this.iw_id};
    $.get(urlIw, data, (result: any) => {
      this.title = result[0].name == null ? "" : result[0].name;
      this.description = result[0].description == null ? "" : result[0].description;
      this.pdsa_tag = result[0].pdsa_tag == null ? "" : result[0].pdsa_tag;
      this.upvotes = result[0].upvotes;
      this.problem = result[0].problem;
      this.goal = result[0].goal == null ? "" : result[0].goal;
      this.how = result[0].how == null ? "" : result[0].how;
      this.ideas = result[0].ideas == null ? "" : result[0].ideas;
      this.how_goal = result[0].how_goal == null ? "" : result[0].how_goal;
      this.plan = result[0].plan == null ? "" : result[0].plan;
      this.planned_time = result[0].planned_time == null ? "" : result[0].planned_time;
      this.improvment = result[0].improvment == null ? "" : result[0].improvment;
      this.time = result[0].time == null ? "" : result[0].time;
      this.trends = result[0].trends == null ? "" : result[0].trends;
      this.effects = result[0].effects == null ? "" : result[0].effects;
      this.evaluate_changes = result[0].evaluate_changes == null ? "" : result[0].evaluate_changes;
      this.teachings = result[0].teachings == null ? "" : result[0].teachings;
      this.evaluate_plan = result[0].evaluate_plan == null ? "" : result[0].evaluate_plan;
      this.improvment_plan = result[0].improvment_plan == null ? "" : result[0].improvment_plan;
      this.evaluate_do = result[0].evaluate_do == null ? "" : result[0].evaluate_do;
      this.next_step = result[0].next_step == null ? "" : result[0].next_step;
      this.spreading = result[0].spreading == null ? "" : result[0].spreading;
      this.maintain = result[0].maintain == null ? "" : result[0].maintain;
      this.future = result[0].future == null ? "" : result[0].future;
      this.archive = result[0].archive == null ? "" : result[0].archive;
      this.archive_date = result[0].archive_date == null ? "" : result[0].archive_date;
      this.owner = result[0].responsible_user;

      if (this.pdsa_tag == 'P') {
        this.changestatus('plan');
      } else if (this.pdsa_tag == 'G') {
        this.changestatus('do');
      } else if (this.pdsa_tag == 'S') {
        this.changestatus('study');
      } else if (this.pdsa_tag == 'A') {
        this.changestatus('act');
      }
    })

    let urlActivity = "http://127.0.0.1:8000/Improvment/activitiesByImprovementWork";
    $.get(urlActivity, data, (result: any) => {
      for (var res of result) {
        let newActivity:any,{}={}
        if (res.assignees[0]){
          newActivity = {
            title: res.title,
            description: res.description,
            priority_level: res.priority_level,
            pdsa_tag: res.pdsa_tag,
            finished: res.finished,
            assignees: res.assignees[0].users
          };
        }else{
          newActivity = {
            title: res.title,
            description: res.description,
            priority_level: res.priority_level,
            pdsa_tag: res.pdsa_tag, 
            finished: res.finished,
            assignees: []
          };
          }
        this.activities.push(newActivity);
      }
    })

    let urlTeam ="http://127.0.0.1:8000/Improvment/participantsOnImprovmentWork";
    let team_data = {team_id: data.id};
    $.get(urlTeam, team_data, (result: any) => {
      for (var res of result) {
          let user = {
            name: res.first_name + " " + res.last_name,
            id: res.has_id,
            center: res.center.name,
            unit: res.unit.name,
            place: res.place.name,
            email: res.email
          }
          if (res.email != this.owner.email) {
            this.team.push(user);
          }
      }
    })
  }

  putIW() {
    console.log(this.activities)
    let url = "http://127.0.0.1:8000/Improvment/improvment_work/" + this.iw_id + "/";
    let iw = {
      name: this.title.length > 0 ? this.title : null,
      description: this.description.length > 0 ? this.description : null,
      pdsa_tag: this.pdsa_tag,
      upvotes: this.upvotes,
      problem: this.problem.length > 0 ? this.problem: null,
      goal: this.goal.length > 0 ? this.goal: null,
      how: this.how.length > 0 ? this.how: null,
      ideas: this.ideas.length > 0 ? this.ideas: null,
      how_goal: this.how_goal.length > 0 ? this.how_goal: null,
      plan: this.plan.length > 0 ? this.plan: null,
      planned_time: this.planned_time.length > 0 ? this.planned_time: null,
      improvment: this.improvment.length > 0 ? this.improvment: null,
      time: this.time.length > 0 ? this.time: null,
      trends: this.trends.length > 0 ? this.trends: null,
      effects: this.effects.length > 0 ? this.effects: null,
      evaluate_changes: this.evaluate_changes.length > 0 ? this.evaluate_changes: null,
      teachings: this.teachings.length > 0 ? this.teachings: null,
      evaluate_plan: this.evaluate_plan.length > 0 ? this.evaluate_plan: null,
      improvment_plan: this.improvment_plan.length > 0 ? this.improvment_plan: null,
      evaluate_do: this.evaluate_do.length > 0 ? this.evaluate_do: null,
      next_step: this.next_step.length > 0 ? this.next_step: null,
      spreading: this.spreading.length > 0 ? this.spreading: null,
      maintain: this.maintain.length > 0 ? this.maintain: null,
      future: this.future.length > 0 ? this.future: null,
      archive: this.archive.length > 0 ? this.archive: null,
      archive_date: this.archive_date.length > 0 ? this.archive_date: null,
      finished: "false", 
      published: "true",
      responsible_user: this.owner.has_id, 
      activities : this.activities,
      team : this.team
    };

    if(iw.name == null || iw.description == null || iw.problem == null || iw.goal == null || iw.how == null ||
      iw.plan == null || iw.planned_time == null || iw.evaluate_changes == null){
      this.showHelpContainer = true;
      this.highlight_compulsory_fields = true;
    } else {
      $.ajax({
        url: url,
        type: "PUT",
        data: JSON.stringify(iw),
        dataType: "json",
        contentType: "application/json"
      });
      this.addUserNotification()
      this.addActivityNotification()
    }
  }

  saveIW(){
    const url = "http://127.0.0.1:8000/Improvment/improvment_work";

    let newIW = {
      name: this.title.length > 0 ? this.title : null,
      description: this.description.length > 0 ? this.description : null,
      pdsa_tag: this.pdsa_tag,
      upvotes: this.upvotes,
      problem: this.problem.length > 0 ? this.problem: null,
      goal: this.goal.length > 0 ? this.goal: null,
      how: this.how.length > 0 ? this.how: null,
      ideas: this.ideas.length > 0 ? this.ideas: null,
      how_goal: this.how_goal.length > 0 ? this.how_goal: null,
      plan: this.plan.length > 0 ? this.plan: null,
      planned_time: this.planned_time.length > 0 ? this.planned_time: null,
      improvment: this.improvment.length > 0 ? this.improvment: null,
      time: this.time.length > 0 ? this.time: null,
      trends: this.trends.length > 0 ? this.trends: null,
      effects: this.effects.length > 0 ? this.effects: null,
      evaluate_changes: this.evaluate_changes.length > 0 ? this.evaluate_changes: null,
      teachings: this.teachings.length > 0 ? this.teachings: null,
      evaluate_plan: this.evaluate_plan.length > 0 ? this.evaluate_plan: null,
      improvment_plan: this.improvment_plan.length > 0 ? this.improvment_plan: null,
      evaluate_do: this.evaluate_do.length > 0 ? this.evaluate_do: null,
      next_step: this.next_step.length > 0 ? this.next_step: null,
      spreading: this.spreading.length > 0 ? this.spreading: null,
      maintain: this.maintain.length > 0 ? this.maintain: null,
      future: this.future.length > 0 ? this.future: null,
      archive: this.archive.length > 0 ? this.archive: null,
      archive_date: this.archive_date.length > 0 ? this.archive_date: null,
      finished: "false",
      published: "false",
      responsible_user: this.owner.has_id, 
      activities : this.activities,
      team : this.team
    };

    $.ajax({
      url:url,
      type:"POST",
      data: JSON.stringify(newIW),
      dataType:"json",
      contentType: "application/json"
    });
  }

  addUserNotification() {
    const filtered_notification_team = this.notification_team.filter(
      notification => this.team.some(teamMember => teamMember.id === notification.id)
    );
    let content = this.owner.first_name + " " + this.owner.last_name + " har lagt till dig på förbättringsarbetet angående " + this.title + ".";
    const url = 'http://127.0.0.1:8000/user/iwNotification';
    let data = {
      notification_content: content,
      users_id: filtered_notification_team.map(user => ({ id: user.id }))
    }
    $.ajax({
      url:url,
      type:"POST",
      data: JSON.stringify(data),
      dataType:"json",
      contentType: "application/json"
    });
  }

  addActivityNotification() {
    const url = 'http://127.0.0.1:8000/user/iwNotification';
    for (const activity of this.activities) {
      let content = "Du har blivit tilldelad aktiviteten " + activity.title + " på förbättringsarbetet angående " + this.title + ".";
      let activity_team = [];
      if (!Array.isArray(activity.responsible_users) || activity.responsible_users.length === 0) {
        activity_team = this.team;
      } else {
        for (let member of activity.responsible_users) {
          let user = {id: member.id};
          activity_team.push(user);
        }
      }

      let data = {
        notification_content: content,
        users_id: activity_team
      }
      $.ajax({
        url:url,
        type:"POST",
        data: JSON.stringify(data),
        dataType:"json",
        contentType: "application/json"
      });
    }
  }
}