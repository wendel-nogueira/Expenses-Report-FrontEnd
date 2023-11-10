import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-flat-button',
  standalone: true,
  templateUrl: './flat-button.component.html',
  styleUrls: ['./flat-button.component.css'],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class FlatButtonComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() type = '';
  @Input() disabled = false;
  @Input() useIcon = true;
  @Input() loading = false;
  @Output() clickButton = new EventEmitter();

  onClick(event: Event) {
    event.preventDefault();

    this.clickButton.emit();
  }
}
