import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-input-text',
  standalone: true,
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class InputTextComponent implements OnChanges {
  @Input() label = '';
  @Input() value = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() name = '';
  @Input() isRequired = true;
  @Input() minLength = 2;
  @Input() maxLength = 50;
  @Input() pattern = '';
  @Input() isDisabled = false;
  @Input() alreadyExists = false;
  @Output() changeValue = new EventEmitter();
  @Output() isInvalid = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.value = changes['value'].currentValue;
      this.fieldFormControl.setValue(this.value);
    }

    if (changes['alreadyExists']) {
      this.alreadyExists = changes['alreadyExists'].currentValue;

      if (this.alreadyExists) {
        this.fieldFormControl.setErrors({ emailExists: true });
        this.isInvalid.emit(true);
      }
    }

    if (changes['isDisabled']) {
      this.isDisabled = changes['isDisabled'].currentValue;

      if (this.isDisabled) {
        this.fieldFormControl.disable();
      } else {
        this.fieldFormControl.enable();
      }
    }
  }

  fieldFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(this.minLength),
    Validators.maxLength(this.maxLength),
    Validators.pattern(this.pattern),
  ]);

  matcher = new ErrorStateMatcher();

  onChangeValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.changeValue.emit(value);

    if (this.fieldFormControl.invalid) {
      this.isInvalid.emit(true);
      return;
    }

    this.isInvalid.emit(false);
  }

  onInputValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (value.length > this.maxLength) {
      this.fieldFormControl.setValue(value.substring(0, this.maxLength));
    }

    if (this.fieldFormControl.invalid) {
      this.isInvalid.emit(true);
      return;
    }

    this.isInvalid.emit(false);
  }
}
