import { RulesType } from '@/js/types'

export const CLIMB_NAME_FORM_VALIDATION_RULES: RulesType = {
  required: 'A name is required.',
  minLength: {
    value: 2,
    message: 'Minimum 2 characters.'
  },
  maxLength: {
    value: 120,
    message: 'Maximum 120 characters.'
  }
}

export const CLIMB_DESCRIPTION_FORM_VALIDATION_RULES: RulesType = {
  maxLength: {
    value: 3500,
    message: 'Maximum 3500 characters.'
  }
}

export const CLIMB_LOCATION_FORM_VALIDATION_RULES: RulesType = {
  maxLength: {
    value: 3500,
    message: 'Maximum 3500 characters.'
  }
}

export const CLIMB_PROTECTION_FORM_VALIDATION_RULES: RulesType = {
  maxLength: {
    value: 800,
    message: 'Maximum 800 characters.'
  }
}
