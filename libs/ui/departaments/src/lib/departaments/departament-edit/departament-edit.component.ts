import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DepartamentService } from '../../../../../../services/departament/departament.service';
import { UserService } from '../../../../../../services/user/user.service';
import { Departament } from '../../../../../../models/Departament';
import { User } from '../../../../../../models/User';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'lib-departament-edit',
  standalone: true,
  templateUrl: './departament-edit.component.html',
  styleUrls: ['./departament-edit.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgIf,
  ],
})
export class DepartamentEditComponent implements OnInit {
  id: string | null = null;
  departament: Departament | null = null;
  allUsers: User[] = [];
  managers: string[] = [];
  managersToUpdate: string[] = [];
  users: string[] = [];
  usersToUpdate: string[] = [];
  loading = true;
  currentUrl = this.router.url;

  constructor(
    private departamentService: DepartamentService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
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

  fields = [
    this.nameFormControl,
    this.acronymFormControl,
    this.descriptionFormControl,
  ];

  managersFormControl = new FormControl<string[] | null>([]);
  usersFormControl = new FormControl<string[] | null>([]);

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
        this.nameFormControl.setValue(departament.name);
        this.acronymFormControl.setValue(departament.acronym);
        this.descriptionFormControl.setValue(departament.description);

        this.getUsers();
      });
  }

  getDepartamentManagers() {
    this.departamentService
      .getDepartamentManagers(this.id as string)
      .subscribe((managers) => {
        this.managers = managers.managersId;

        this.managersFormControl.setValue(this.managers);
      });
  }

  getDepartamentUsers() {
    this.departamentService
      .getDepartamentUsers(this.id as string)
      .subscribe((users) => {
        this.users = users.usersId;

        this.usersFormControl.setValue(this.users);
      });
  }

  getUsers() {
    this.userService.getUsers().subscribe((users) => {
      this.allUsers = users;

      this.getDepartamentManagers();
      this.getDepartamentUsers();

      this.loading = false;
    });
  }

  onAcronymChange() {
    if (this.acronymFormControl.invalid) return;

    const acronym = this.acronymFormControl.value as string;

    this.departamentService.checkAcronymExists(acronym).subscribe((exists) => {
      if (exists && this.departament?.acronym !== acronym) {
        this.acronymFormControl.setErrors({ invalid: true });
      }
    });
  }

  onSubmit() {
    if (this.id === null) return;
    if (this.fields.some((field) => field.invalid)) return;

    const departament: Departament = {
      id: this.id,
      name: this.nameFormControl.value as string,
      acronym: this.acronymFormControl.value as string,
      description: this.descriptionFormControl.value as string,
    };

    this.departamentService.updateDepartament(departament).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }

  onDeactivate() {
    if (this.id === null) return;

    this.departamentService.deleteDepartament(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }

  onActivate() {
    if (this.id === null) return;

    this.departamentService.activateDepartament(this.id).subscribe(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.currentUrl]);
      });
    });
  }

  onChangeManagers() {
    const managersToUpdate = this.managersFormControl.value as string[];

    const managersToAdd = managersToUpdate.filter(
      (manager) => !this.departament?.managers?.includes(manager)
    );

    const managersToRemove = this.managers?.filter(
      (manager) => !managersToUpdate.includes(manager)
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

  onChangeUsers() {
    const usersToUpdate = this.usersFormControl.value as string[];

    const usersToAdd = usersToUpdate.filter(
      (user) => !this.departament?.users?.includes(user)
    );

    const usersToRemove = this.users?.filter(
      (user) => !usersToUpdate.includes(user)
    );

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
