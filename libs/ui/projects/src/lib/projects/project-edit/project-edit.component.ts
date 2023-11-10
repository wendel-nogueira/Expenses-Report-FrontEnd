/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { ProjectService } from 'libs/services/project/project.service';
import { Project } from 'libs/models/Project';
import { DepartamentService } from 'libs/services/departament/departament.service';
import { Departament } from 'libs/models/Departament';
import { HeaderComponent } from 'libs/ui/page/header/header.component';
import { ContentComponent } from 'libs/ui/page/content/content.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { RedirectButtonComponent } from 'libs/ui/buttons/redirect-button/redirect-button.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { InputTextComponent } from 'libs/ui/forms/input-text/input-text.component';
import { TextFieldComponent } from 'libs/ui/forms/text-field/text-field.component';
import {
  SelectComponent,
  SelectOption,
} from 'libs/ui/forms/select/select.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'lib-project-edit',
  standalone: true,
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    ContentComponent,
    FormComponent,
    FormGroupComponent,
    InputTextComponent,
    SelectComponent,
    TextFieldComponent,
    FlatButtonComponent,
    RedirectButtonComponent,
    ButtonGroupComponent,
    MatSnackBarModule,
  ],
})
export class ProjectEditComponent implements OnInit {
  id: string | null = null;
  project: Project | null = null;
  allDepartaments: Departament[] = [];
  departaments: SelectOption[] = [];
  loading = true;
  currentUrl = this.router.url;

  name = '';
  code = '';
  description = '';
  departament = '';

  nameIsInvalid = false;
  codeIsInvalid = false;
  codeExists = false;
  departamentIsInvalid = false;

  constructor(
    private projectService: ProjectService,
    private departamentService: DepartamentService,
    private router: Router,
    private route: ActivatedRoute,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');

      if (this.id) {
        this.getProject();
      }
    });
  }

  getProject() {
    this.projectService
      .getProjectById(this.id as string)
      .subscribe((project) => {
        this.project = project;
        this.loading = false;

        this.name = this.project.name;
        this.code = this.project.code;
        this.description = this.project.description;
        this.departament = this.project.departamentId;

        this.getDepartaments();
      });
  }

  getDepartaments() {
    this.departamentService.getDepartaments().subscribe((departaments) => {
      this.allDepartaments = departaments;

      const allDepartaments: SelectOption[] = [];

      this.allDepartaments.forEach((departament) => {
        allDepartaments.push({
          value: departament.id as string,
          viewValue: departament.name,
        });
      });

      this.departaments = allDepartaments;
    });
  }

  codeChangeValue(code: string) {
    if (this.codeIsInvalid || !this.project) return;

    this.codeExists = false;
    this.project.code = code;

    this.projectService.checkCodeExists(code).subscribe((exists) => {
      if (exists && exists.id !== this.id) {
        this.codeExists = true;
      }
    });
  }

  onSubmit() {
    if (
      !this.id ||
      !this.project ||
      this.nameIsInvalid ||
      this.codeIsInvalid ||
      this.codeExists ||
      this.departamentIsInvalid
    ) {
      this.matSnackBar.open(
        'Invalid fields! Check that the fields have been filled in correctly.',
        '',
        {
          duration: 4000,
          panelClass: ['red-snackbar'],
        }
      );

      return;
    }

    this.project.departamentId = this.departament;

    this.projectService
      .updateProject(this.id as string, this.project)
      .subscribe(
        () => {
          this.matSnackBar.open('Project updated successfully!', '', {
            duration: 4000,
            panelClass: ['green-snackbar'],
          });

          this.router.navigate(['/projects']);
        },
        () => {
          this.matSnackBar.open('Error updating project!', '', {
            duration: 4000,
            panelClass: ['red-snackbar'],
          });
        }
      );
  }

  onDeactivate(event: Event) {
    event.preventDefault();

    if (!this.id) return;

    this.projectService.deactivateProject(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }

  onActivate(event: Event) {
    event.preventDefault();

    if (!this.id) return;

    this.projectService.activateProject(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }
}
