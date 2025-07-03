export type FormFieldType = 'text' | 'email' | 'password' | 'select' | 'checkbox' | 'button' | 'button-group' | 'date'

export interface FormButton {
    name: string
    label: string
    customButton?: 'loginBtn' | 'saveBtn' | 'cancelBtn'
    mustValidate?: boolean
}

export interface FormField {
    name: string
    label: string
    type: FormFieldType
    required?: boolean
    options?: string[]
    buttons?: FormButton[]
}
