import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-searched-user',
  templateUrl: './searched-user.component.html',
  styleUrls: ['./searched-user.component.scss']
})
export class SearchedUserComponent {
  
  @Input() name: string ='';
  @Input() id: number = 0;
  @Input() unit: string = '';
  @Input() center: string = '';
  @Input() place: string = '';
  @Input() email: string = '';
  @Output() addMember = new EventEmitter<void>();  
  
  addTeamMate(){
    this.addMember.emit();

}
}
