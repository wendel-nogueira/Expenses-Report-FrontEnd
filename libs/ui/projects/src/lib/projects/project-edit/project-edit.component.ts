import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../../../../../services/project/project.service';
import { Project } from '../../../../../../models/Project';
import { DepartamentService } from '../../../../../../services/departament/departament.service';
import { Departament } from '../../../../../../models/Departament';

@Component({
  selector: 'lib-project-edit',
  standalone: true,
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
})
export class ProjectEditComponent implements OnInit {
  id: string | null = null;
  project: Project | null = null;
  departaments: Departament[] = [];
  loading = true;
  currentUrl = this.router.url;

  constructor(
    private projectService: ProjectService,
    private departamentService: DepartamentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
  ]);
  codeFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(10),
  ]);
  departamentFormControl = new FormControl('', [Validators.required]);
  descriptionFormControl = new FormControl('', []);

  matcher = new ErrorStateMatcher();

  fields = [
    this.nameFormControl,
    this.codeFormControl,
    this.departamentFormControl,
    this.descriptionFormControl,
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');

      if (this.id) {
        this.getProject();
      }
    });
  }

  getProject() {
    this.projectService.getProjectById(this.id as string).subscribe((project) => {
      this.project = project;
      this.loading = false;

      this.nameFormControl.setValue(project.name);
      this.codeFormControl.setValue(project.code);
      this.departamentFormControl.setValue(project.departamentId);
      this.descriptionFormControl.setValue(project.description);

      this.getDepartaments();
    });
  }

  getDepartaments() {
    this.departamentService.getDepartaments().subscribe((departaments) => {
      this.departaments = departaments;
    });
  }

  onCodeChange() {
    if (this.codeFormControl.invalid) return;

    const code = this.codeFormControl.value as string;

    this.projectService.checkCodeExists(code).subscribe((exists) => {
      if (exists && this.project?.code !== code) {
        this.codeFormControl.setErrors({ invalid: true });
      }
    });
  }

  onSubmit() {
    if (this.fields.some((field) => field.invalid)) return;

    const name = this.nameFormControl.value;
    const code = this.codeFormControl.value;
    const description = this.descriptionFormControl.value as string;
    const departamentId = this.departamentFormControl.value;

    if (!name || !code || !departamentId) return;

    const newProject: Project = {
      name,
      code,
      description,
      departamentId,
    };

    this.projectService.updateProject(this.id as string, newProject).subscribe(() => {
      this.router.navigate(['/projects']);
    });
  }

  onDeactivate() {
    if (this.id === null) return;

    this.projectService.deleteProject(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }

  onActivate() {
    if (this.id === null) return;

    this.projectService.activateProject(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }
}
