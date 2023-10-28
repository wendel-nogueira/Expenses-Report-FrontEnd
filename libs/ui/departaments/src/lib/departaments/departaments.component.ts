import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartamentsListComponent } from './departaments-list/departaments-list.component';

@Component({
  selector: 'lib-departaments',
  standalone: true,
  templateUrl: './departaments.component.html',
  styleUrls: ['./departaments.component.css'],
  imports: [CommonModule, DepartamentsListComponent],
})
export class DepartamentsComponent {}
