import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { User, UserList } from '../../User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iwmodal',
  templateUrl: './iwmodal.component.html',
  standalone: true,
  styleUrls: ['./iwmodal.component.scss'],
  imports: [ MatDialogModule, CommonModule ]
})
export class IwmodalComponent implements OnInit {
  planPhaseBackgroundColor = "#182745";
  planPhaseTextColor = "#FFFFFF";
  doAtivePhaseBackgroundColor = "#BDD2FB";
  doActivePhaseTextColor = "#45475F";
  studyPhaseBackgroundColor = "#BDD2FB";
  studyPhaseTextColor = "#45475F";
  actAtivePhaseBackgroundColor = "#BDD2FB";
  actActivePhaseTextColor = "#45475F";
  finished: boolean = false;
  canEditActivity: boolean = false;

  id;
  name;
  department;
  description;
  status;
  display_status;
  center;
  unit;
  problem;
  goal;
  how;
  ideas;
  how_goal;
  plan;
  planned_time;
  improvment;
  time;
  trends;
  effects;
  evaluate_changes;
  teachings;
  evaluate_plan;
  improvment_plan;
  evaluate_do;
  next_step;
  spreading;
  maintain;
  future;
  archive;
  archive_date;
  created_at;
  numberOfLikes;
  numberOfComments;
  owner_id;
  comment!: Comment;
  commentList: CommentList = [];
  answer!: Answer;
  is_owner = false;
  owner: User;
  activities: any[] = [];
  participantList: UserList = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data : any, public auth: AuthService, private router: Router){
    this.id = data.id;
    this.owner_id = data.has_id;
    this.name = data.name;
    this.department = data.department;
    this.description = data.description;
    this.status = data.status;
    this.owner = data.owner;
    this.display_status = data.status.toUpperCase();
    this.center = data.center;
    this.unit = data.unit;
    this.problem = data.problem;
    this.goal = data.goal;
    this.how = data.how;
    this.ideas = data.ideas;
    this.how_goal = data.how_goal;
    this.plan = data.plan;
    this.planned_time = data.planned_time;
    this.improvment = data.improvment;
    this.time = data.time;
    this.trends = data.trends;
    this.effects = data.effects;
    this.evaluate_changes = data.evaluate_changes;
    this.teachings = data.teachings;
    this.evaluate_plan = data.evaluate_plan;
    this.improvment_plan = data.improvment_plan;
    this.evaluate_do = data.evaluate_do;
    this.next_step = data.next_step;
    this.spreading = data.spreading;
    this.maintain = data.maintain;
    this.future = data.future;
    this.archive = data.archive;
    this.archive_date = data.archive_date;
    this.numberOfComments = data.numberOfComments;
    this.numberOfLikes = data.numberOfLikes;
    this.created_at = data.created_at;
    
  }

  changestatus(phase: string) {
    if (phase == "P") {
      this.planPhaseBackgroundColor = "#182745";
      this.planPhaseTextColor = "#FFFFFF";
      this.doAtivePhaseBackgroundColor = "#BDD2FB";
      this.doActivePhaseTextColor = "#45475F";
      this.studyPhaseBackgroundColor = "#BDD2FB";
      this.studyPhaseTextColor = "#45475F";
      this.actAtivePhaseBackgroundColor = "#BDD2FB";
      this.actActivePhaseTextColor = "#45475F";
    } else if (phase == "G") {
      this.planPhaseBackgroundColor = "#BDD2FB";
      this.planPhaseTextColor = "#45475F";
      this.doAtivePhaseBackgroundColor = "#182745";
      this.doActivePhaseTextColor = "#FFFFFF";
      this.studyPhaseBackgroundColor = "#BDD2FB";
      this.studyPhaseTextColor = "#45475F";
      this.actAtivePhaseBackgroundColor = "#BDD2FB";
      this.actActivePhaseTextColor = "#45475F";
    }else if (phase == "S") {
      this.planPhaseBackgroundColor = "#BDD2FB";
      this.planPhaseTextColor = "#45475F";
      this.doAtivePhaseBackgroundColor = "#BDD2FB";
      this.doActivePhaseTextColor = "#45475F";
      this.studyPhaseBackgroundColor = "#182745";
      this.studyPhaseTextColor = "#FFFFFF";
      this.actAtivePhaseBackgroundColor = "#BDD2FB";
      this.actActivePhaseTextColor = "#45475F";
    } else if (phase == "A") {
      this.planPhaseBackgroundColor = "#BDD2FB";
      this.planPhaseTextColor = "#45475F";
      this.doAtivePhaseBackgroundColor = "#BDD2FB";
      this.doActivePhaseTextColor = "#45475F";
      this.studyPhaseBackgroundColor = "#BDD2FB";
      this.studyPhaseTextColor = "#45475F";
      this.actAtivePhaseBackgroundColor = "#182745";
      this.actActivePhaseTextColor = "#FFFFFF";
    }
  }

  // set the status for which pdsa tab that should be shown
  setDisplayStatus(input_status: string) {
    this.display_status = input_status;
  }

  //Set the color of activity border to right priority
  activityBorder(priority_level: any): string {
    return priority_level === 'h' ? '#0071D9' : '#E5CF00';
  }



  changeStatus(index: number) {
    if(this.activities[index].finished){
      this.activities[index].finished = false;
      this.finished = false;
    } else {
      this.activities[index].finished = true;
      this.finished = true;
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



  showComment() {
    this.commentList.push(this.comment)
    console.log(this.created_at)
  }

  calculateTimeDifference(createdAt: string): string {

    let timeDifference;
    
    const createdAtDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - createdAtDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInDays = Math.floor(diffInMinutes / (60 * 24));

    if (diffInMinutes < 60) {
      timeDifference = `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const diffInHours = Math.floor(diffInMinutes / 60);
      timeDifference = `${diffInHours} hours ago`;
    } else {
      timeDifference = `${diffInDays} days ago`;
    }
    return timeDifference;
  }

  getComments() {
    let url = `http://127.0.0.1:8000/Improvment/comment?Improvment=${this.id}`;

    this.commentList = [];

    $.get(url, (comments: CommentList) => {

      for (var comment of comments) {
        this.comment = {
          User: {
            first_name: comment.User.first_name,
            last_name: comment.User.last_name,
            auth_lvl: comment.User.auth_lvl,
            profession: comment.User.profession,
            has_id: comment.User.has_id
          },
          answers: comment.answers.map((answer) => ({
            id: answer.id,
            answer: answer.answer,
            created_at: this.calculateTimeDifference(answer.created_at),
            User: {
              first_name: answer.User.first_name,
              last_name: answer.User.last_name,
              auth_lvl: answer.User.auth_lvl,
              profession: answer.User.profession,
              has_id: answer.User.has_id
            }
          })),
          id: comment.id,
          comment: comment.comment,
          Improvment_work: comment.Improvment_work,
          created_at: this.calculateTimeDifference(comment.created_at),
        }
        this.showComment();
      }
    });
  }

  ngOnInit(): void {

    this.getComments();

    const plan = document.getElementById("p") as HTMLImageElement;
    const doing = document.getElementById("d") as HTMLImageElement;
    const study = document.getElementById("s") as HTMLImageElement;
    const act = document.getElementById("a") as HTMLImageElement;

    //Show the active PDSA status "bubble" 
    this.changestatus(this.status);
    if (this.status === "P" || this.status === "p") {
      plan.classList.add("pdsa-status");
      doing.classList.remove("pdsa-status");
      study.classList.remove("pdsa-status");
      act.classList.remove("pdsa-status");
    } else if (this.status === "G" || this.status === "g") {
      plan.classList.remove("pdsa-status");
      doing.classList.add("pdsa-status");
      study.classList.remove("pdsa-status");
      act.classList.remove("pdsa-status");
    } else if (this.status === "S" || this.status === "s") {
      plan.classList.remove("pdsa-status");
      doing.classList.remove("pdsa-status");
      study.classList.add("pdsa-status");
      act.classList.remove("pdsa-status");
    } else if (this.status === "A" || this.status === "a") {
      plan.classList.remove("pdsa-status");
      doing.classList.remove("pdsa-status");
      study.classList.remove("pdsa-status");
      act.classList.add("pdsa-status");
    }

    let url = "http://127.0.0.1:8000/Improvment/activitiesByImprovementWork";
    $.get(url, this.data, (result: any) => {
      console.log(result)
      this.activities=result

    })

    url = "http://127.0.0.1:8000/Improvment/participantsOnImprovmentWork";
    $.get(url, {team_id: this.id}, (result: User[]) => {
      for (var participant of result) {
        if (participant?.has_id || this.owner?.has_id) {
          if (participant.has_id !== this.owner.has_id) {
            const newUser: User = {
              auth_lvl: participant.auth_lvl,
              first_name: participant.first_name,
              last_name: participant.last_name,
              has_id: participant.has_id,
              profession: participant.profession
            }
            this.participantList.push(newUser);
            this.canEditActivity = true;
          }
          }
        }
      }
    )

    //See if the user that opens the modal is the owner or not
    this.auth.user$.subscribe((user) => {
      if (user && user.email) {
        const url = "http://127.0.0.1:8000/Improvment/ownerImprovmentWork";
      $.get(url, this.data, (result: any) => {
        if (result[0].responsible_user.email === user.email) {
          this.is_owner = true;
          this.canEditActivity = true;
        }
      })
      }
    });
  }

  goToDrive() {
    window.location.href = 'https://drive.google.com/drive/u/0/folders/16hOTazuUG7Hgkw10kvC1OolKOzzg1J2c';
  }

  getUserByAuth0(): Promise<User> {

    return new Promise((resolve, reject) => {
     // get user
     this.auth.user$.subscribe((authUser) => {
      if (authUser && authUser?.email) {
        const url = "http://127.0.0.1:8000/user/userfromemail";
        const data = { email: authUser.email };

        $.get(url, data, (result: any) => {
          // Convert to User
          const user: User = {
            has_id: result.has_id,
            profession: result.profession,
            email: result.email,
            last_name: result.last_name,
            first_name: result.first_name,
            auth_lvl: result.auth_lvl,
            center: result.center.id,
            unit: result.unit.id,
            place: result.place.id
          };
          resolve(user);
        });
      } else {
        reject("User not authenticated or email not available");
      }
    });
  });
}

  async sendComment(comment: string, commentValue: HTMLElement) {

    var commentOwner: User = await this.getUserByAuth0();
    const url = 'http://127.0.0.1:8000/Improvment/comment';
    const data = {
      comment: comment,
      User: commentOwner.has_id,
      Improvment_work: this.id
    }

    $.post(url, data, (response: any) => {
      
      this.getComments();
      this.commentNotification();

    });

  }

  toggleAnswerDiv(id: number) {

    const answerBoxId = 'answerBox' + id
    var toggleAnswerBox = document.getElementById(answerBoxId) ? document.getElementById(answerBoxId) : null;

    if (toggleAnswerBox?.style?.display) {
      toggleAnswerBox.style.display = (toggleAnswerBox.style.display === 'none') ? 'block' : 'none';
    }
   
  }

  async sendAnswer(answer: string, commentId: number, answerValue: HTMLElement) {

    var commentOwner: User = await this.getUserByAuth0();
    const url = 'http://127.0.0.1:8000/Improvment/Answer';
    const data = {
      User: commentOwner.has_id,
      Comment: commentId,
      answer: answer
    }

    $.post(url, data, (response: any) => {
      this.getComments();
      this.commentNotification();
    });
  }

  goToEdit() {
    const id = this.id;
    this.router.navigate(['/create', id]);
  }

  commentNotification() {
    const team = [];
    for (var participantKey in this.participantList) {
      const participant = this.participantList[participantKey];
      const user = {id: participant.has_id};  
      team.push(user);
    }
    const owner = {id: this.owner_id};
    team.push(owner);
    console.log(team);
    let content = "En ny kommentar på förbättringsarbetet angående " + this.name;

    const url = 'http://127.0.0.1:8000/user/iwNotification';
    let data = {
      notification_content: content,
      users_id: team
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

export interface Answer {
  id: number;
  answer: string;
  User: User;
  created_at: string;
}

export type AnswerList = Answer[];

export interface Comment {
  id: number;
  comment: string;
  User: User;
  Improvment_work: number;
  answers: AnswerList;
  created_at: string;
}

export type CommentList = Comment[];