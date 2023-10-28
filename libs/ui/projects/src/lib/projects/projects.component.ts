import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsListComponent } from './projects-list/projects-list.component';

@Component({
  selector: 'lib-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  imports: [
    CommonModule,
    ProjectsListComponent
  ],
})
export class ProjectsComponent {}
