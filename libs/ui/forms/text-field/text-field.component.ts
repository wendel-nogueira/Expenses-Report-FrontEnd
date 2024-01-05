import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-text-field',
  standalone: true,
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class TextFieldComponent implements OnChanges {
  @Input() label = '';
  @Input() value = '';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Output() changeValue = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.value = changes['value'].currentValue;
      this.textFieldFormControl.setValue(this.value);
    }

    if (changes['disabled']) {
      this.disabled = changes['disabled'].currentValue;
      if (this.disabled) {
        this.textFieldFormControl.disable();
      } else {
        this.textFieldFormControl.enable();
      }
    }
  }

  textFieldFormControl = new FormControl('', []);
  matcher = new ErrorStateMatcher();

  onChangeValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.changeValue.emit(value);
  }
}
