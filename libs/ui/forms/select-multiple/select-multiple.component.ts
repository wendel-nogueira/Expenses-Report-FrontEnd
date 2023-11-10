import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-select-multiple',
  standalone: true,
  templateUrl: './select-multiple.component.html',
  styleUrls: ['./select-multiple.component.css'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
})
export class SelectMultipleComponent implements OnChanges {
  @Input() label = '';
  @Input() value: string[] = [];
  @Input() isDisabled = false;
  @Input() options: SelectMultipleOption[] = [];
  @Output() changeValue = new EventEmitter();

  matcher = new ErrorStateMatcher();
  selectMultipleFormControl = new FormControl<string[] | null>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.value = changes['value'].currentValue;
      this.selectMultipleFormControl.setValue(this.value);
    }

    if (changes['isDisabled']) {
      this.isDisabled = changes['isDisabled'].currentValue;

      if (this.isDisabled) {
        this.selectMultipleFormControl.disable();
      } else {
        this.selectMultipleFormControl.enable();
      }
    }
  }

  onChange(event: MatSelectChange) {
    const value = event.value as string[];

    this.changeValue.emit(value);
  }
}

export interface SelectMultipleOption {
  value: string;
  viewValue: string;
}
