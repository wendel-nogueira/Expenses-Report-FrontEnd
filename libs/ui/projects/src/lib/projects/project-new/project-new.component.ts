import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProjectService } from 'libs/services/project/project.service';
import { Project } from 'libs/models/Project';
import { DepartamentService } from 'libs/services/departament/departament.service';
import { Departament } from 'libs/models/Departament';
import { AuthService } from 'libs/services/auth/auth.service';
import { UserService } from 'libs/services/user/user.service';
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
  selector: 'lib-project-new',
  standalone: true,
  templateUrl: './project-new.component.html',
  styleUrls: ['./project-new.component.css'],
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
export class ProjectNewComponent implements OnInit {
  allDepartaments: Departament[] = [];
  departaments: SelectOption[] = [];

  isAccountant = false;

  name = '';
  nameIsInvalid = true;
  code = '';
  codeIsInvalid = true;
  codeExists = false;
  departament = '';
  departamentIsInvalid = true;
  description = '';

  constructor(
    private projectService: ProjectService,
    private departamentService: DepartamentService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const role = this.authService.getIdentity()?.role;

    this.isAccountant = role === 'Accountant';

    this.getDepartaments();
  }

  getDepartaments() {
    if (this.isAccountant) {
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
    } else {
      const userIdentity = this.authService.getIdentity()?.nameid as string;

      this.userService.getUserByIdentityId(userIdentity).subscribe((user) => {
        if (!user) return;

        this.departamentService
          .getDepartamentsRelated(user.id as string)
          .subscribe((departaments) => {
            this.allDepartaments = departaments;
          });
      });
    }
  }

  codeChangeValue(code: string) {
    if (this.codeIsInvalid) return;

    this.codeExists = false;
    this.code = code;

    this.projectService.checkCodeExists(code).subscribe((exists) => {
      if (exists) {
        this.codeExists = true;
      }
    });
  }

  onSubmit() {
    if (this.nameIsInvalid || this.codeIsInvalid || this.departamentIsInvalid) {
      this.matSnackBar.open('Invalid fields! Check that the fields have been filled in correctly.', '', {
        duration: 4000,
        panelClass: ['red-snackbar'],
      });

      return;
    }

    const newProject: Project = {
      name: this.name,
      code: this.code,
      description: this.description,
      departamentId: this.departament,
    };

    this.projectService.createProject(newProject).subscribe(
      () => {
        this.matSnackBar.open('Project created successfully!', '', {
          duration: 4000,
          panelClass: ['green-snackbar'],
        });

        this.router.navigate(['/projects']);
      },
      () => {
        this.matSnackBar.open('Error creating project!', '', {
          duration: 4000,
          panelClass: ['red-snackbar'],
        });
      }
    );
  }
}
