import { Type } from "@angular/core";

export interface FieldTypeDefinition{
    type: string;
    label: string;
    icon: string;
    defaultConfig: any;
    settingsConfig: FieldSettingsDefinition[];
    component: Type<unknown>;
    generateCode: (field: FormField) => string
}

export interface FieldSettingsDefinition {
    type: 'text' | 'checkbox' | 'select' | 'dynamic-options' ;
    key: string;
    label: string;
    options?: OptionItem[];
}

export interface OptionItem {
    label: string;
    value: string;
}

export interface FormField {
    id: string;
    type: string;
    label: string;
    required: boolean;
    inputType?: string;
    placeholder?: string;
    options?: OptionItem[];
}