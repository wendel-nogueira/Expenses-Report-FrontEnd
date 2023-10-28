import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
import { ProjectService } from '../../../../../../services/project/project.service';
import { Project } from '../../../../../../models/Project';
import { DepartamentService } from '../../../../../../services/departament/departament.service';
import { Departament } from '../../../../../../models/Departament';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { UserService } from '../../../../../../services/user/user.service';

@Component({
  selector: 'lib-project-new',
  standalone: true,
  templateUrl: './project-new.component.html',
  styleUrls: ['./project-new.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
  ],
})
export class ProjectNewComponent implements OnInit {
  departaments: Departament[] = [];

  isAccountant = false;

  constructor(
    private projectService: ProjectService,
    private departamentService: DepartamentService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
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
    const role = this.authService.getIdentity()?.role;

    this.isAccountant = role === 'Accountant';

    this.getDepartaments();
  }

  getDepartaments() {
    if (this.isAccountant) {
      this.departamentService.getDepartaments().subscribe((departaments) => {
        this.departaments = departaments;
      });
    } else {
      const userIdentity = this.authService.getIdentity()?.nameid as string;

      this.userService.getUserByIdentityId(userIdentity).subscribe((user) => {
        if (!user) return;

        this.departamentService
          .getDepartamentsRelated(user.id as string)
          .subscribe((departaments) => {
            this.departaments = departaments;
          });
      });
    }
  }

  onCodeChange() {
    if (this.codeFormControl.invalid) return;

    const code = this.codeFormControl.value as string;

    this.projectService.checkCodeExists(code).subscribe((exists) => {
      if (exists) {
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

    this.projectService.createProject(newProject).subscribe(() => {
      this.router.navigate(['/projects']);
    });
  }
}
