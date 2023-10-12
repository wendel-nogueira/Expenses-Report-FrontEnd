/* eslint-disable @nx/enforce-module-boundaries */
import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { IdentityService } from '../../../../../../services/identity/identity.service';
import { Role } from '../../../../../../models/Role';
import { Identity } from '../../../../../../models/Identity';

@Component({
  selector: 'lib-user-new',
  standalone: true,
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css'],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    MatSelectModule,
    MatIconModule,
    RouterModule,
  ],
})
export class UserNewComponent implements OnInit {
  roles: Role[] = [];

  constructor(
    private identityService: IdentityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.identityService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
  ]);
  rolesFormControl = new FormControl('', [Validators.required]);

  matcher = new ErrorStateMatcher();

  fields = [this.emailFormControl, this.rolesFormControl];

  onEmailChange() {
    if (this.emailFormControl.invalid) return;

    const email = this.emailFormControl.value as string;

    this.identityService.checkEmailExists(email).subscribe((exists) => {
      if (exists) {
        this.emailFormControl.setErrors({ invalid: true });
      }
    });
  }

  onSubmit() {
    if (this.fields.some((field) => field.invalid)) return;

    const email = this.emailFormControl.value;
    const role = this.rolesFormControl.value;

    if (!email || !role) return;

    const roleEnumId = parseInt(role);

    this.identityService
      .createIdentity({
        email,
        role: roleEnumId,
      } as Identity)
      .subscribe(() => {
        this.router.navigate(['/users']);
      });
  }
}
