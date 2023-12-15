/* eslint-disable @nx/enforce-module-boundaries */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../../../services/file/file.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-input-file',
  standalone: true,
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class InputFileComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() isDisabled = false;
  @Output() changeValue = new EventEmitter();
  @Output() isInvalid = new EventEmitter();

  constructor(private fileService: FileService) {}

  fileFormControl = new FormControl('', [Validators.required]);
  matcher = new ErrorStateMatcher();

  fileUrl = '';
  loading = false;

  onChangeValue(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.files === null || target.files.length === 0) {
      this.isInvalid.emit(true);
      return;
    }

    const file = target.files[0];
    this.loading = true;

    this.fileService.uploadFile(file).subscribe(
      (response) => {
        this.fileUrl = response.uri;
        this.changeValue.emit(response.uri);
        this.isInvalid.emit(false);
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.isInvalid.emit(true);
        this.loading = false;
      }
    );
  }

  onAbort(event: Event) {
    console.log(event);
  }
}
