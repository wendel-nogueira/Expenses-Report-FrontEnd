import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css'],
  imports: [CommonModule, MatIconModule],
})
export class IconComponent {
  @Input() icon = '';
  @Input() show = true;
  @Output() onclick = new EventEmitter();

  onClick() {
    this.onclick.emit();
  }
}
