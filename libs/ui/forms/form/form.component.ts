import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class FormComponent implements OnChanges {
  @Input() loading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading']) this.loading = changes['loading'].currentValue;
  }
}
