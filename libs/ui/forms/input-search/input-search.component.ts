import { MatInputModule } from '@angular/material/input';
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input-search',
  standalone: true,
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.css'],
  imports: [
    CommonModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatIconModule
  ],
})
export class InputSearchComponent {
  @Output() changeValue = new EventEmitter();

  onChangeValue(event: any) {
    this.changeValue.emit(event.target.value);
  }
}
