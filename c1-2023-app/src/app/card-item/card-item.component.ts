import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../Card';
import { IwmodalComponent } from '../browsingpage/iwmodal/iwmodal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit {

  @Input() card!: Card;

  constructor(private dialogRef: MatDialog) { }

  openContact(contact: any) {
    // TODO: Open contact info modal.
    console.log("UNIT: " + this.card.unit);
  }

  openModal(scrollToComments: boolean = false) {
    // TODO: Take in argument of where to open modal @, e.g. auto-scroll to comments if
    //       clicking the comments icon is how the modal was opened.

    const dialogRef = this.dialogRef.open(IwmodalComponent, {
      data: {
        id: this.card.id,
        has_id: this.card.owner_id,
        name: this.card.title,
        department: this.card.department,
        description: this.card.description,
        status: this.card.pdsaTag,
        owner: this.card.owner,
        center: this.card.center,
        unit: this.card.unit,
        problem: this.card.problem,
        goal: this.card.goal,
        how: this.card.how,
        evaluate_changes: this.card.evaluate_changes,
        ideas: this.card.ideas,
        how_goal: this.card.how_goal,
        plan: this.card.plan,
        planned_time: this.card.planned_time,
        improvment: this.card.improvment,
        time: this.card.time,
        trends: this.card.trends,
        effects: this.card.effects,
        teachings: this.card.teachings,
        evaluate_plan: this.card.evaluate_plan,
        improvment_plan: this.card.improvment_plan,
        evaluate_do: this.card.evaluate_do,
        next_step: this.card.next_step,
        spreading: this.card.spreading,
        maintain: this.card.maintain,
        future: this.card.future,
        archive: this.card.archive,
        archive_date: this.card.archive_date,
        numberOfComments: this.card.numberOfComments,
        numberOfLikes: this.card.numberOfLikes,
        created_at: this.card.created_at
    },
        width : '75%',
        height : '90%'
    });

    if (scrollToComments) {
      dialogRef.afterOpened().subscribe(() => {
        setTimeout(() => {
          const commentsSection = document.querySelector('.comments');
          if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      });
    }

  }


  ngOnInit(): void {/*
    const url = "http://127.0.0.1:8000/user/unit";
    const data = {user.unit}
    $.get(url, (result: any) => {
      for (var res of result) {*/


  }

  pdsaInt(): number {
    switch (this.card.pdsaTag) {
      case "P": {
        return 0;
      }
      case "G": {
        return 1;
      }
      case "S": {
        return 2;
      }
      case "A": {
        return 3;
      }
      default: {
        return -1;
      }
    }
  }

  stageStyleObject(stage: number): Object {
    if (stage <= this.pdsaInt()) {
      return { '--stage-color': "#182745", '--stage-text-color': "#FFFFFF" };
    }
    return { '--stage-color': "#DFDFDF", '--stage-text-color': "#717171" };
  }

}