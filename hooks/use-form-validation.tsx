import { useState, useCallback } from "react"
import { ValidationErrors, ValidationRules, validateField, validateForm, getConditionalValidationRules, getRoleSpecificValidationRules } from "@/lib/form-validation"

export interface UseFormValidationProps {
  initialData: Record<string, string>
  validationRules: ValidationRules
  selectedRole?: string
}

export interface UseFormValidationReturn {
  formData: Record<string, string>
  errors: ValidationErrors
  isSubmitting: boolean
  updateField: (fieldName: string, value: string) => void
  validateFieldOnBlur: (fieldName: string) => void
  validateFormOnSubmit: () => boolean
  clearErrors: () => void
  setSubmitting: (submitting: boolean) => void
  hasErrors: boolean
}

export const useFormValidation = ({
  initialData,
  validationRules,
  selectedRole = ""
}: UseFormValidationProps): UseFormValidationReturn => {
  const [formData, setFormData] = useState<Record<string, string>>(initialData)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = useCallback((fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    
    // Clear error for this field when user starts typing
    setErrors(prev => {
      if (prev[fieldName]) {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      }
      return prev
    })
  }, [])

  const validateFieldOnBlur = useCallback((fieldName: string) => {
    const roleRules = getRoleSpecificValidationRules(selectedRole)
    const conditionalRules = getConditionalValidationRules(roleRules, formData, selectedRole)
    const error = validateField(fieldName, formData[fieldName] || "", conditionalRules)
    
    setErrors(prev => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[fieldName] = error
      } else {
        delete newErrors[fieldName]
      }
      return newErrors
    })
  }, [formData, selectedRole])

  const validateFormOnSubmit = useCallback((): boolean => {
    const roleRules = getRoleSpecificValidationRules(selectedRole)
    const conditionalRules = getConditionalValidationRules(roleRules, formData, selectedRole)
    const newErrors = validateForm(formData, conditionalRules)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, selectedRole])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const setSubmitting = useCallback((submitting: boolean) => {
    setIsSubmitting(submitting)
  }, [])

  const hasErrors = Object.keys(errors).length > 0

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateFieldOnBlur,
    validateFormOnSubmit,
    clearErrors,
    setSubmitting,
    hasErrors
  }
}
