/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DepartamentService } from '../../../../../../services/departament/departament.service';
import { RedirectButtonComponent } from 'libs/ui/buttons/redirect-button/redirect-button.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { HeaderComponent } from 'libs/ui/page/header/header.component';
import { ContentComponent } from 'libs/ui/page/content/content.component';
import { InputTextComponent } from 'libs/ui/forms/input-text/input-text.component';
import { TextFieldComponent } from 'libs/ui/forms/text-field/text-field.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import { Departament } from 'libs/models/Departament';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'lib-departament-new',
  standalone: true,
  templateUrl: './departament-new.component.html',
  styleUrls: ['./departament-new.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    ContentComponent,
    InputTextComponent,
    FormGroupComponent,
    FlatButtonComponent,
    RedirectButtonComponent,
    ButtonGroupComponent,
    TextFieldComponent,
    FormComponent,
    MatSnackBarModule,
  ],
})
export class DepartamentNewComponent {
  name = '';
  nameIsInvalid = true;
  acronym = '';
  acronymExists = false;
  acronymIsInvalid = true;
  description = '';

  constructor(
    private departamentService: DepartamentService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {}

  acronymChangeValue(acronym: string) {
    if (!acronym || this.acronymIsInvalid) return;

    this.acronym = acronym;

    this.departamentService.checkAcronymExists(acronym).subscribe((exists) => {
      if (exists) {
        this.acronymExists = true;
      }
    });
  }

  onSubmit() {
    if (this.nameIsInvalid || this.acronymIsInvalid || this.acronymExists) {
      this.matSnackBar.open('Invalid fields! Check that the fields have been filled in correctly.', '', {
        duration: 4000,
        panelClass: ['red-snackbar'],
      });

      return;
    }

    const newDepartament: Departament = {
      name: this.name,
      acronym: this.acronym,
      description: this.description,
    };

    this.departamentService.createDepartament(newDepartament).subscribe(() => {
      this.matSnackBar.open('Departament created successfully!', '', {
        duration: 4000,
        panelClass: ['green-snackbar'],
      });

      this.router.navigate(['/departaments']);
    }, () => {
      this.matSnackBar.open('Error creating departament!', '', {
        duration: 4000,
        panelClass: ['red-snackbar'],
      });
    });
  }
}
