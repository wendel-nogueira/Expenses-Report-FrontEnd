import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-redirect-button',
  standalone: true,
  templateUrl: './redirect-button.component.html',
  styleUrls: ['./redirect-button.component.css'],
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
})
export class RedirectButtonComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() type = '';
  @Input() disabled = false;
  @Input() path = '/';
}
