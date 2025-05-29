import { Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormField } from '../../../models/field';

@Component({
  selector: 'app-select-field',
  imports: [MatSelectModule, MatFormFieldModule],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>{{ field().label}}</mat-label>
      <mat-select [required]="field().required">
        @if (field().options) {
          @for (option of field().options; track option.value) {
            <mat-option [value]="option.value">{{ option.label}}</mat-option>
          }
        }@else {
            <mat-option value="option1"> Option1</mat-option>
            <mat-option value="option2"> Option2</mat-option>
            <mat-option value="option3"> Option3</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  styles: ``
})
export class SelectFieldComponent {

  field = input.required<FormField>();
}
