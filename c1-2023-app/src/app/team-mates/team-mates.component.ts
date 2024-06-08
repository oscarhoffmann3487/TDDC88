import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-team-mates',
  templateUrl: './team-mates.component.html',
  styleUrls: ['./team-mates.component.scss']
})
export class TeamMatesComponent {

  @Input() name: string ='';
  @Input() id: number = 0;
  @Input() height: string = '';
  @Input() width: string = '';
  @Input() margin: string = '';
  @Input() bottom: string = '';
  @Output() deleteTeamOutput = new EventEmitter<void>();  
  
  removeTeamMate(){
    this.deleteTeamOutput.emit();
  }

  getStyle(){
    return("height:"+this.height+"width:"+this.width+"margin-left:"+this.margin+"margin-bottom:"+this.bottom);
  }
}
