import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { FieldTypeDefinition, FormField } from '../../../models/field';
import { FieldTypesService } from '../../../services/field-types.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FormService } from '../../../services/form.service';

@Component({
  selector: 'app-field-preview',
  imports: [NgComponentOutlet],
  template: `
    <div>
    <ng-container 
        [ngComponentOutlet] = "previewComponent()" 
        [ngComponentOutletInputs]="{field:field()}"
      > 
      </ng-container>
    </div>
  `,
  styles: ``
})
export class FieldPreviewComponent {
  field = input.required<FormField>();
  fieldTypesService = inject(FieldTypesService);
  formService = inject(FormService);

  previewComponent = computed(() => {
    const type = this.fieldTypesService.getFieldType(this.field().type);
    return type?.component ?? null;
  });


  onDropInRow(event: CdkDragDrop<string>, rowId: string) {

    if(event.previousContainer.data === 'field-selector') {
        const fieldType = event.item.data as FieldTypeDefinition;
        const newField: FormField = {
          id: crypto.randomUUID(),
          type: fieldType.type,
          ...fieldType.defaultConfig,
        }

        this.formService.addField(newField, rowId, event.currentIndex);
    }

    

  }
}
