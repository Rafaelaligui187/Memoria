import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getErrorStyling, getErrorMessageStyling } from "@/lib/form-validation"

interface FormFieldProps {
  id: string
  label: string
  type?: "text" | "email" | "number" | "textarea" | "select"
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  rows?: number
  options?: Array<{ value: string; label: string }>
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  disabled = false,
  rows = 3,
  options = [],
  className = ""
}) => {
  const errorStyling = getErrorStyling(!!error)
  const errorMessageStyling = getErrorMessageStyling()

  const renderField = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={`${errorStyling} ${className}`}
          />
        )
      
      case "select":
        return (
          <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger className={`${errorStyling} ${className}`}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      
      default:
        return (
          <Input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`${errorStyling} ${className}`}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {error && (
        <p className={errorMessageStyling}>
          {error}
        </p>
      )}
    </div>
  )
}

// Specialized components for common field types
export const TextField: React.FC<Omit<FormFieldProps, "type">> = (props) => (
  <FormField {...props} type="text" />
)

export const EmailField: React.FC<Omit<FormFieldProps, "type">> = (props) => (
  <FormField {...props} type="email" />
)

export const NumberField: React.FC<Omit<FormFieldProps, "type">> = (props) => (
  <FormField {...props} type="number" />
)

export const TextareaField: React.FC<Omit<FormFieldProps, "type">> = (props) => (
  <FormField {...props} type="textarea" />
)

export const SelectField: React.FC<Omit<FormFieldProps, "type">> = (props) => (
  <FormField {...props} type="select" />
)
