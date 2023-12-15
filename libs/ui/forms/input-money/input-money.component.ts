import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-input-money',
  standalone: true,
  templateUrl: './input-money.component.html',
  styleUrls: ['./input-money.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class InputMoneyComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() isDisabled = false;
  @Output() changeValue = new EventEmitter();
  @Output() isInvalid = new EventEmitter();

  moneyFormControl = new FormControl('', [Validators.required]);
  matcher = new ErrorStateMatcher();

  onChangeValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.changeValue.emit(value);

    if (value === '') {
      this.isInvalid.emit(true);
    } else {
      this.isInvalid.emit(false);
    }
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    let formattedValue = value.replace(/[^0-9.]/g, '');
    const decimalParts = formattedValue.split('.');

    if (decimalParts.length > 1) {
      decimalParts[1] = decimalParts[1].slice(0, 2);
    }

    formattedValue = decimalParts.join('.');

    (event.target as HTMLInputElement).value = formattedValue.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ','
    );
  }
}
