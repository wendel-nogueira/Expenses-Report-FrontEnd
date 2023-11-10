/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { DepartamentService } from '../../../../../../services/departament/departament.service';
import { UserService } from '../../../../../../services/user/user.service';
import { Departament } from '../../../../../../models/Departament';
import { User } from '../../../../../../models/User';
import { RedirectButtonComponent } from 'libs/ui/buttons/redirect-button/redirect-button.component';
import { FlatButtonComponent } from 'libs/ui/buttons/flat-button/flat-button.component';
import { FormGroupComponent } from 'libs/ui/forms/form-group/form-group.component';
import { FormComponent } from 'libs/ui/forms/form/form.component';
import { HeaderComponent } from 'libs/ui/page/header/header.component';
import { ContentComponent } from 'libs/ui/page/content/content.component';
import { InputTextComponent } from 'libs/ui/forms/input-text/input-text.component';
import { TextFieldComponent } from 'libs/ui/forms/text-field/text-field.component';
import { ButtonGroupComponent } from 'libs/ui/buttons/button-group/button-group.component';
import {
  SelectMultipleComponent,
  SelectMultipleOption,
} from 'libs/ui/forms/select-multiple/select-multiple.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'lib-departament-edit',
  standalone: true,
  templateUrl: './departament-edit.component.html',
  styleUrls: ['./departament-edit.component.css'],
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
    SelectMultipleComponent,
    FormComponent,
    MatSnackBarModule,
  ],
})
export class DepartamentEditComponent implements OnInit {
  id: string | null = null;
  departament: Departament | null = null;
  allUsers: SelectMultipleOption[] = [];
  managers: string[] = [];
  users: string[] = [];
  loading = true;
  currentUrl = this.router.url;

  nameIsInvalid = false;
  acronymExists = false;
  acronymIsInvalid = false;

  name = '';
  acronym = '';
  description = '';

  constructor(
    private departamentService: DepartamentService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');

      if (this.id) {
        this.getDepartament();
      }
    });
  }

  getDepartament() {
    this.departamentService
      .getDepartamentById(this.id as string)
      .subscribe((departament) => {
        this.departament = departament;

        this.name = this.departament.name;
        this.acronym = this.departament.acronym;
        this.description = this.departament.description;

        this.getUsers();
      });
  }

  getDepartamentManagers() {
    this.departamentService
      .getDepartamentManagers(this.id as string)
      .subscribe((managers) => {
        this.managers = managers.managersId;
      });
  }

  getDepartamentUsers() {
    this.departamentService
      .getDepartamentUsers(this.id as string)
      .subscribe((users) => {
        this.users = users.usersId;
      });
  }

  getUsers() {
    this.userService.getUsers().subscribe((users) => {
      const allUsers: SelectMultipleOption[] = [];

      users.forEach((user: User) => {
        allUsers.push({
          value: user.id as string,
          viewValue: `${user.name.firstName} ${user.name.lastName}`,
        });
      });

      this.allUsers = allUsers;

      this.getDepartamentManagers();
      this.getDepartamentUsers();

      this.loading = false;
    });
  }

  acronymChangeValue(acronym: string) {
    if (!acronym || this.acronymIsInvalid || !this.departament) return;

    if (this.departament) this.departament.acronym = acronym;

    this.departamentService.checkAcronymExists(acronym).subscribe((exists) => {
      if (exists && exists.id !== this.departament?.id) {
        this.acronymExists = true;
      }
    });
  }

  onSubmit() {
    if (
      this.id === null ||
      !this.departament ||
      this.nameIsInvalid ||
      this.acronymIsInvalid
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

    this.departament.name = this.name;
    this.departament.description = this.description;

    this.departamentService
      .updateDepartament(this.departament)
      .subscribe(() => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(
          () => {
            this.matSnackBar.open('Departament updated successfully!', '', {
              duration: 4000,
              panelClass: ['green-snackbar'],
            });

            this.router.navigate([this.currentUrl]);
          },
          () => {
            this.matSnackBar.open('Error updating departament!', '', {
              duration: 4000,
              panelClass: ['red-snackbar'],
            });
          }
        );
      });
  }

  onActivate(event: Event) {
    event.preventDefault();

    if (this.id === null) return;

    this.departamentService.activateDepartament(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }

  onDeactivate(event: Event) {
    event.preventDefault();

    if (this.id === null) return;

    this.departamentService.deactivateDepartament(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }

  changeManagersValue(managers: string[]) {
    const managersToAdd = managers.filter(
      (manager) => !this.managers.includes(manager)
    );
    const managersToRemove = this.managers.filter(
      (manager) => !managers.includes(manager)
    );

    if (managersToAdd[0] !== undefined) {
      this.departamentService
        .addDepartamentManager(this.id as string, managersToAdd[0])
        .subscribe(() => {
          this.managers.push(managersToAdd[0]);
        });
    }

    if (managersToRemove && managersToRemove[0] !== undefined) {
      const index = this.departament?.managers?.indexOf(
        managersToRemove[0] as string
      );

      this.departamentService
        .removeDepartamentManager(this.id as string, managersToRemove[0])
        .subscribe(() => {
          this.managers.splice(index as number, 1);
        });
    }
  }

  changeUsersValue(users: string[]) {
    const usersToAdd = users.filter((user) => !this.users.includes(user));
    const usersToRemove = this.users.filter((user) => !users.includes(user));

    if (usersToAdd[0] !== undefined) {
      this.departamentService
        .addDepartamentUser(this.id as string, usersToAdd[0])
        .subscribe(() => {
          this.users.push(usersToAdd[0]);
        });
    }

    if (usersToRemove && usersToRemove[0] !== undefined) {
      const index = this.departament?.users?.indexOf(
        usersToRemove[0] as string
      );

      this.departamentService
        .removeDepartamentUser(this.id as string, usersToRemove[0])
        .subscribe(() => {
          this.users.splice(index as number, 1);
        });
    }
  }
}
