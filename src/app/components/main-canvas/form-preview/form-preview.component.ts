import { Component, inject } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { FieldPreviewComponent } from "../field-preview/field-preview.component";

@Component({
  selector: 'app-form-preview',
  imports: [FieldPreviewComponent],
  template: `
    <div class="py-6">
      <div class="p-6 flex flex-col gap-4 shadow-md rounded-lg border border-gray-200">
        @for (row of formService.rows(); track row.id) {
          <div class="flex gap-4 flex-wrap">
              @for(field of row.fields; track field.id) {
                <app-field-preview class="flex1" [field]="field" />               
              }
          </div>
        }
      </div>
    </div>
  `,
  styles: ``
})
export class FormPreviewComponent {

  formService = inject(FormService)
}
