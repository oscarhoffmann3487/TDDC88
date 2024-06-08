import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  @Input() showConfirmationDialog = false;
  @Input() confirmationText = '';
  @Output() confirmEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

  confirmPost() {
    this.confirmEvent.emit();
  }

  cancelPost() {
    this.cancelEvent.emit();
  }
}
