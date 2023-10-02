import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-master-page',
  standalone: true,
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.css'],
  imports: [CommonModule, RouterModule],
})
export class MasterPageComponent {}
