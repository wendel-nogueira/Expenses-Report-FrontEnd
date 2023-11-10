import { MatInputModule } from '@angular/material/input';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormsModule,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input-password',
  standalone: true,
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
})
export class InputPasswordComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() isDisabled = false;
  @Output() changeValue = new EventEmitter();
  @Output() isInvalid = new EventEmitter();

  hide = true;

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(50),
  ]);

  matcher = new ErrorStateMatcher();

  onChangeValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.changeValue.emit(value);

    if (this.passwordFormControl.invalid) {
      this.isInvalid.emit(true);
      return;
    }

    this.isInvalid.emit(false);
  }

  onInputValue() {
    if (this.passwordFormControl.invalid) {
      this.isInvalid.emit(true);
      return;
    }

    this.isInvalid.emit(false);
  }

  hidePassword(event: Event) {
    event.preventDefault();

    this.hide = !this.hide;
  }
}
