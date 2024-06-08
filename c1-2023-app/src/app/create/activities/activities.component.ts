import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent {
  prioText: string = '';

  @Input() title: string ='';
  @Input() description: string = '';
  @Input() priority: string = '';
  @Input() finished: boolean = false;
  @Input() team: any[] = [];
  @Input() canEdit: boolean = true;
  @Output() editActivityOutput = new EventEmitter<void>();
  @Output() deleteActivityOutput = new EventEmitter<void>();
  @Output() changeActivityStatusOutput = new EventEmitter<void>();

  constructor(){

  };
  editActivity() {
    
    this.editActivityOutput.emit();
  }

  changeStatus() {
    if (this.finished) {
      this.finished = false; 
    } else {
      this.finished = true;
    }
    this.changeActivityStatusOutput.emit();
  }

  deleteActivity(){
    this.deleteActivityOutput.emit();
  }

  getPrio(){
    if (this.priority == 'h'){
      return "Högre prioritet"
    }else{
      return "Lägre prioritet"
    }
  }
}
