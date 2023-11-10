import { MatInputModule } from '@angular/material/input';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormsModule,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-input-email',
  standalone: true,
  templateUrl: './input-email.component.html',
  styleUrls: ['./input-email.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class InputEmailComponent implements OnChanges {
  @Input() label = '';
  @Input() value = '';
  @Input() isDisabled = false;
  @Input() emailExists = false;
  @Output() changeValue = new EventEmitter();
  @Output() isInvalid = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.value = changes['value'].currentValue;
      this.emailFormControl.setValue(this.value);
    }

    if (changes['emailExists']) {
      this.emailExists = changes['emailExists'].currentValue;

      if (this.emailExists) {
        this.emailFormControl.setErrors({ emailExists: true });
        this.isInvalid.emit(true);
      }
    }

    if (changes['isDisabled']) {
      this.isDisabled = changes['isDisabled'].currentValue;

      if (this.isDisabled) {
        this.emailFormControl.disable();
      } else {
        this.emailFormControl.enable();
      }
    }
  }

  onChangeValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.changeValue.emit(value);

    if (this.emailFormControl.invalid) {
      this.isInvalid.emit(true);
      return;
    }

    this.isInvalid.emit(false);
  }

  onInputValue() {
    if (this.emailFormControl.invalid) {
      this.isInvalid.emit(true);
      return;
    }

    this.isInvalid.emit(false);
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
  ]);

  matcher = new ErrorStateMatcher();
}
