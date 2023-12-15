import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-input-date',
  standalone: true,
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
})
export class InputDateComponent {
  @Input() label = '';
  @Input() value: Date = new Date();
  @Input() isDisabled = false;
  @Output() changeValue = new EventEmitter();
  @Output() isInvalid = new EventEmitter();

  minDate: Date;
  maxDate: Date;

  constructor() {
    const today = new Date();

    this.minDate = new Date();
    this.minDate.setFullYear(today.getFullYear() - 1);
    this.maxDate = today;
  }

  dateFormControl = new FormControl('', [Validators.required]);

  onChangeValue(event: any) {
    const value = event.target.value;

    this.changeValue.emit(value);
    this.isInvalid.emit(false);

    console.log(value);
  }
}
