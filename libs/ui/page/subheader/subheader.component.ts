import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subheader',
  standalone: true,
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.css'],
  imports: [CommonModule],
})
export class SubheaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
