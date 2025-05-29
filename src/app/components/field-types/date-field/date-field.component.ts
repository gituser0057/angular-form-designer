import { Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormField } from '../../../models/field';

@Component({
  selector: 'app-date-field',
  imports: [MatFormFieldModule, MatDatepickerModule, MatInputModule, MatNativeDateModule],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>{{field().label}}</mat-label>
      <input matInput [matDatepicker]="picker" [required]="field().required" />
      <mat-datepicker-toggle 
        matIconSuffix
        [for]="picker"
      >
      </mat-datepicker-toggle>
      <mat-datepicker #picker> </mat-datepicker>
    </mat-form-field>
  `,
  styles: ``
})
export class DateFieldComponent {

  field = input.required<FormField>();
}
