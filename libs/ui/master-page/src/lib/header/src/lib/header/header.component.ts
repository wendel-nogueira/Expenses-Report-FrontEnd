import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'lib-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, MatIconModule, MatListModule, MatExpansionModule],
})
export class HeaderComponent {
  collapsed = false;

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }
}
