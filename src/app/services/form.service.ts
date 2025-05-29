import { computed, inject, Injectable, signal } from '@angular/core';
import { FormRow } from '../models/form';
import { FormField } from '../models/field';
import { FieldTypesService } from './field-types.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private _rows = signal<FormRow[]>([]);
  private _selectedFieldId = signal<string | null>(null);
  public readonly rows = this._rows.asReadonly();
  private fieldTypesService = inject(FieldTypesService);
  public readonly selectedField = computed(() => 
      this.rows().flatMap(row => row.fields)
      .find(f => f.id === this._selectedFieldId()),
  );

  constructor() { 
    this._rows.set([
      {
        id: crypto.randomUUID(),
        fields : [],
      },

    ]);
  }

  addField(field: FormField, rowId: string, index?: number) {

    const rows = this._rows();
    const newRows = rows.map(row => {
      if(row.id === rowId) {
        const updatedFields = [...row.fields];
        if(index !== undefined) {
            updatedFields.splice(index, 0, field);
        } else {
          updatedFields.push(field);
        }
        return {...row, fields: updatedFields}
      }
      return row;
    });

    this._rows.set(newRows);
  }
  deleteField(fieldId: string) {
      const rows = this._rows();
      const newRows = rows.map(row =>({
          ...row,
          fields: row.fields.filter(f => f.id !== fieldId)
      }));
      this._rows.set(newRows); 
  }
  addRow() {
    const newRow: FormRow = {
      id: crypto.randomUUID(),
      fields:[],
    }
    const rows = this._rows();
    this._rows.set([...rows, newRow]);
  }

  deleteRow(rowId: string) {
    if(this._rows.length === 1) {
      return;
    }
    const rows = this._rows();
    const newRows = rows.filter(row => row.id !== rowId);
    this._rows.set(newRows); 
  }

  moveField(fieldId: string, sourceRowId: string, targetRowId: string, targetIndex: number = -1) {

    const rows = this._rows();

    let fieldToMove: FormField | undefined;
    let sourceRowIndex = -1;
    let sourceFieldIndex = -1;

    rows.forEach((row, rowIndex) => {
      if(row.id === sourceRowId) {
        sourceRowIndex = rowIndex;
        sourceFieldIndex = row.fields.findIndex(f => f.id === fieldId);

        if(sourceFieldIndex >= 0) {
          fieldToMove = row.fields[sourceFieldIndex];
        }
      }
    });

    if(!fieldToMove){
      return;
    }

    const newRows = [...rows];
    const fiedlWithRemovedField= newRows[sourceRowIndex].fields.filter(f => f.id !== fieldId);
    newRows[sourceRowIndex].fields = fiedlWithRemovedField;

    const targetRowIndex = newRows.findIndex(r => r.id === targetRowId);

    if(targetRowIndex >= 0) {
      const targetFields = [...newRows[targetRowIndex].fields];
      targetFields.splice(targetIndex, 0, fieldToMove);
      newRows[targetRowIndex].fields = targetFields;
    }

    this._rows.set(newRows);
  }

  setSelectedField(fieldId: string) {
    this._selectedFieldId.set(fieldId);
  }

  updateField(fieldId: string, data: Partial<FormField>) {
    const rows = this._rows();
    const newRows = rows.map(row =>({
      ...row,
      fields: row.fields.map(f => f.id === fieldId ?{ ...f, ...data} : f)
    }));

    this._rows.set(newRows);
  }

  moveRowUp(rowId: string) {
    const rows = this._rows();
    const index = rows.findIndex((r) => r.id === rowId);
    if(index > 0) {
      const newRows = [...rows];
      const temp = newRows[index -1];
      newRows[index -1] = newRows[index];
      newRows[index] = temp;
      this._rows.set(newRows);
    }
  }

  moveRowDown(rowId: string) {
    const rows = this._rows();
    const index = rows.findIndex((r) => r.id === rowId);
    if(index < (rows.length - 1)) {
      const newRows = [...rows];
      const temp = newRows[index + 1];
      newRows[index + 1] = newRows[index];
      newRows[index] = temp;
      this._rows.set(newRows);
    }
  }

  // Exported Related Functionality

  exportForm() {
    const formCode = this.generateFormCode();
    const blob = new Blob([formCode], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'form.ts';
    link.click();
    window.URL.revokeObjectURL(url);    
  }

  generateFormCode(): string {
    let code = this.generateImports();
    code += this.generateComponentDecorator();
    code += `   template: \`\n`;
    code += `     <form class="flex flex-col gap-4" >\n`;

    for(const row of this._rows()) {
      if(row.fields.length > 0){
        code += `       <div class="flex gap-4 flex-wrap">\n`;
        for(const field of row.fields) {
          code += `         <div class="flex gap-4 flex-wrap"> \n`
          code += this.generateFieldCode(field);
          code += `         </div>\n`;
        }
        code += `       </div>\n`;
      }
    }
    code += `     </form>\n`;
    code += `  \`,\n`;
    code += `   styles: [],\n`;
    code += ` })\n`;
    code += ` export class GeneratedFormComponent {\n`;
    code += ` }\n`;

    return code;
  }

  generateFieldCode (field: FormField): string {
      const fieldDef = this.fieldTypesService.getFieldType(field.type);
      return fieldDef?.generateCode(field) || '';
  }

  generateImports(): string {
    return ( 
      `import { Component } from '@angular/core';\n` +
      `import { CommonModule } from '@angular/common';\n` +
      `import { FormsModule } from '@angular/forms';\n` +
      `import { MatFormFieldModule } from '@angular/material/form-field';\n` +
      `import { MatInputModule } from '@angular/material/input';\n` +
      `import { MatSelectModule } from '@angular/material/select';\n` +
      `import { MatCheckboxModule } from '@angular/material/checkbox';\n` +
      `import { MatRadioModule } from '@angular/material/radio';\n` +
      `import { MatDatepickerModule } from '@angular/material/datepicker';\n` +
      `import { MatNativeDateModule } from '@angular/material/core';\n` +
      `import { MatButtonModule } from '@angular/material/button';\n\n` 
    )
  }

  generateComponentDecorator(): string {

    return (
      `@Component({\n` + 
      `   standalone: true,\n` + 
      `   imports: [\n` +
      `       CommonModule,\n` +
      `       FormsModule,\n` +
      `       MatFormFieldModule,\n` +
      `       MatInputModule,\n` +
      `       MatSelectModule,\n` +
      `       MatCheckboxModule,\n` +
      `       MatRadioModule,\n` +
      `       MatDatepickerModule,\n` +
      `       MatNativeDateModule,\n` +
      `       MatButtonModule\n` +
      `   ],\n`
    )
  }

}
