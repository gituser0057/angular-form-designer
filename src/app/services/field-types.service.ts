import { Component, Injectable } from '@angular/core';
import { FieldTypeDefinition } from '../models/field';
import { TextFieldComponent } from '../components/field-types/text-field/text-field.component';
import { CheckboxFieldComponent } from '../components/field-types/checkbox-field/checkbox-field.component';
import { SelectFieldComponent } from '../components/field-types/select-field/select-field.component';
import { DateFieldComponent } from '../components/field-types/date-field/date-field.component';
import { MatLabel } from '@angular/material/form-field';

const TEXT_FIELD_DEFINITION : FieldTypeDefinition = { 
  type: 'text',
  label: 'Text Field',
  icon: 'text_fields',
  defaultConfig: {
    label: 'Text Field',
    required: false,
  },
  settingsConfig:[
    {
      type: 'text', key: 'label', label: 'Label'
    },
    {
      type: 'text', key: 'placeholder', label: 'Placeholder'
    },
    {
      type: 'checkbox', key: 'required', label: 'Required'
    },
    {
      type: 'select', 
      key: 'inputType', 
      label: 'Input Type',
      options:[
        {value: 'text', label: 'Text'},
        {value: 'number', label: 'Number'},
        {value: 'email', label: 'Email'},
        {value: 'tel', label: 'Phone'},
      ],
    },
  ],
  component: TextFieldComponent, 
  generateCode: (field) => `
      <mat-form-field appearance="outline" classs="w-full"> 
        <mat-label> ${field.label} </mat-label>
          <input matInput type="${field.inputType || 'text'}" [required]="${field.required}" placeholder="${field.placeholder}" />
      </mat-form-field>
  `,
}

const CHECKBOX_FIELD_DEFINITION : FieldTypeDefinition =  {
  type: 'checkbox',
  label: 'Checkbox',
  icon: 'check_box',
  defaultConfig: {
    label: 'Checkbox',
    required: false,
  },
  settingsConfig:[
    {
      type: 'text', key: 'label', label: 'Label'
    },
    {
      type: 'checkbox', key: 'required', label: 'Required'
    },
  ],
  component: CheckboxFieldComponent,
  generateCode: (field) => 
    `      <mat-checkbox [required]="${field.required}">${field.label}</mat-checkbox>\n`,
}

const SELECT_FIELD_DEFINITION : FieldTypeDefinition =  {
  type: 'select',
  label: 'Dropdown',
  icon: 'arrow_drop_down_circle',
  component: SelectFieldComponent,
  defaultConfig: {
    label: 'Select',
    required: false,
    options: [
      {
        value: 'option1', label: 'Option 1'
      },
      {
        value: 'option2', label: 'Option 2'
      },
      {
        value: 'option3', label: 'Option 3'
      },
    ],
  },
  settingsConfig:[
    {
      type: 'text', key: 'label', label: 'Label'
    },
    {
      type: 'checkbox', key: 'required', label: 'Required'
    },
    {
      type: 'dynamic-options', key: 'options', label: 'Dropdown Options'
    },
  ],
  generateCode: (field) => {
    let code =
    `              <mat-form-field appearance="outline" class="w-full">\n`  +
    `                 <mat-label>${field.label} </mat-label>\n` +
    `                 <mat-select [required]="${field.required}">\n`;

    if (field.options) {
      field.options.forEach((option) => {
          code += `                   <mat-option value="${option.value}"> ${option.label} </mat-option>\n`;
      });
    } else {
      code += 
      `                     <mat-option value="option1">Option 1 </mat-option>\n` +
      `                     <mat-option value="option2">Option 2 </mat-option>\n` +
      `                     <mat-option value="option3">Option 3 </mat-option>\n`;
    }

    code += `                 </mat-select>\n` + `              </mat-form-field>\n`;
    return code;
  },
  
}

const DATE_FIELD_DEFINITION : FieldTypeDefinition ={

  type: 'date',
  label: 'Date Picker',
  icon: 'calendar_today',
  component: DateFieldComponent,
  defaultConfig: {
    label: 'Date',
    required: false
  },
  settingsConfig: [
      { type: 'text', key: 'label', label: 'Label' },
      { type: 'checkbox', key: 'required', label: 'Required' }
  ],
  generateCode: (field) => 
    `             <mat-form-field appearance="outline" class="w-full"> \n` +
    `                 <mat-label> ${field.label} </mat-label> \n` +
    `                 <input matInput [matDatepicker]="picker${field.id}" [required]="${field.required}" />\n` +
    `                 <mat-datepicker-toggle matIconSuffix [for]="${field.id}"></mat-datepicker-toggle>\n` +
    `                 <mat-datepicker #picker${field.id}></mat-datepicker>\n` +
    `             </mat-form-field>\n`,
}

@Injectable({
  providedIn: 'root'
})
export class FieldTypesService {

  fieldTypes = new Map<String, FieldTypeDefinition>([
    ['text', TEXT_FIELD_DEFINITION], 
    ['checkbox', CHECKBOX_FIELD_DEFINITION],
    ['select', SELECT_FIELD_DEFINITION],
    ['date', DATE_FIELD_DEFINITION]
  ]);

  getFieldType(type:string): FieldTypeDefinition | undefined {
    return this.fieldTypes.get(type);
  }

  getAllFieldTypes(): FieldTypeDefinition[] {
    return Array.from(this.fieldTypes.values());
  }
}
