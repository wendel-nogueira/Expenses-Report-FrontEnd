import { Component } from '@angular/core';
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
import { DepartamentService } from '../../../../../../services/departament/departament.service';
import { Departament } from '../../../../../../models/Departament';

@Component({
  selector: 'lib-departament-new',
  standalone: true,
  templateUrl: './departament-new.component.html',
  styleUrls: ['./departament-new.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
})
export class DepartamentNewComponent {
  constructor(
    private departamentService: DepartamentService,
    private router: Router
  ) {}

  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
  ]);
  acronymFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(10),
  ]);
  descriptionFormControl = new FormControl('', []);

  matcher = new ErrorStateMatcher();

  fields = [this.nameFormControl, this.acronymFormControl, this.descriptionFormControl];

  onAcronymChange() {
    if (this.acronymFormControl.invalid) return;

    const acronym = this.acronymFormControl.value as string;

    this.departamentService.checkAcronymExists(acronym).subscribe((exists) => {
      console.log(exists);
      if (exists) {
        this.acronymFormControl.setErrors({ invalid: true });
      }
    });
  }

  onSubmit() {
    if (this.fields.some((field) => field.invalid)) return;

    const name = this.nameFormControl.value;
    const acronym = this.acronymFormControl.value;
    const description = this.descriptionFormControl.value;

    if (!name || !acronym) return;

    const newDepartament: Departament = {
      name,
      acronym,
      description: description || '',
    };

    this.departamentService
      .createDepartament(newDepartament)
      .subscribe(() => {
        this.router.navigate(['/departaments']);
      });
  }
}
