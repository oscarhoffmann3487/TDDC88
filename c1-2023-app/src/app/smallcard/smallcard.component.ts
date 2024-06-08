import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../Card';
import { IwmodalComponent } from '../browsingpage/iwmodal/iwmodal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-smallcard',
  templateUrl: './smallcard.component.html',
  styleUrls: ['./smallcard.component.scss']
})
export class SmallcardComponent {
  @Input() card!: Card;

  constructor(private dialogRef: MatDialog) { }

  openContact(contact: any) {
    console.warn('openContact not yet implemented in smallcar.component.ts');
  }

  openModal(title: any, scrollToComments: boolean = false) {
    const url = "http://127.0.0.1:8000/Improvment/ImprovmentWorkByTitle";

    const data = {
      title: title
    }

    $.get(url, data, (result: any) => {
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
          evaluate_plan: this.card.evaluate_plan,
          improvment_plan: this.card.improvment_plan,
          evaluate_do: this.card.evaluate_do,
          teachings: this.card.teachings,
          next_step: this.card.next_step,
          spreading: this.card.spreading,
          maintain: this.card.maintain,
          future: this.card.future,
          numberOfComments: this.card.numberOfComments,
          numberOfLikes: this.card.numberOfLikes,
          archive: this.card.archive
        },
        width: '75%',
        height: '85%',
        panelClass: 'custom-modalbox'
      });

      if (scrollToComments) {
        dialogRef.afterOpened().subscribe(() => {
          setTimeout(() => {
            const commentsSection = document.querySelector('.comments');
            if (commentsSection) {
              commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 200);
        });
      }

    });

  }

  getPdsaStatus(): string {
    if (this.card.pdsaTag === 'P') {
      return "../../assets/iwmodal/icon_progress_p.png";
    } else if (this.card.pdsaTag === 'G') {
      return "../../assets/iwmodal/icon_progress_d.png";
    } else if (this.card.pdsaTag === 'S') {
      return "../../assets/iwmodal/icon_progress_s.png";
    } else if (this.card.pdsaTag === 'A') {
      return "../../assets/iwmodal/icon_progress_a.png";
    } else {
      return '';
    }
  }

  ngOnInit(): void {
    // ...
  }
}
