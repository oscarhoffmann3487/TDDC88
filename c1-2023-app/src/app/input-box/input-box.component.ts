import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss']
})
export class InputBoxComponent {

  inputValue: string = '';
}
