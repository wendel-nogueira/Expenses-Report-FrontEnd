import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [CommonModule, MatIconModule],
})
export class FooterComponent {}
