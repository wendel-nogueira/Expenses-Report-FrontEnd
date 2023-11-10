import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule],
})
export class SelectComponent implements OnChanges {
  @Input() label = '';
  @Input() value = '';
  @Input() isDisabled = false;
  @Input() options: SelectOption[] = [];
  @Output() changeValue = new EventEmitter();
  @Output() isInvalid = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.value = changes['value'].currentValue;
      this.selectFormControl.setValue(this.value);
    }

    if (changes['isDisabled']) {
      this.isDisabled = changes['isDisabled'].currentValue;

      if (this.isDisabled) {
        this.selectFormControl.disable();
      } else {
        this.selectFormControl.enable();
      }
    }
  }

  selectFormControl = new FormControl('', [Validators.required]);
  matcher = new ErrorStateMatcher();

  onChange(event: MatSelectChange) {
    const value = event.value as string;

    if (value === '') {
      this.isInvalid.emit(true);
    } else {
      this.isInvalid.emit(false);
    }

    this.changeValue.emit(value);
  }
}

export interface SelectOption {
  value: string;
  viewValue: string;
}
