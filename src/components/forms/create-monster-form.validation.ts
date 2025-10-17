import { DEFAULT_MONSTER_LEVEL, DEFAULT_MONSTER_STATE } from '@/types/monster'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'

export interface CreateMonsterFormDraft {
  name: string
  draw: string
}

export type CreateMonsterFormErrors = Partial<Record<keyof CreateMonsterFormDraft, string>>

export interface CreateMonsterFormValidationResult {
  errors: CreateMonsterFormErrors
  values?: CreateMonsterFormValues
}

export const createInitialFormState = (): CreateMonsterFormDraft => ({
  name: '',
  draw: ''
})

export const validateCreateMonsterForm = (
  draft: CreateMonsterFormDraft
): CreateMonsterFormValidationResult => {
  const trimmedName = draft.name.trim()
  const trimmedDraw = draft.draw.trim()

  const errors: CreateMonsterFormErrors = {}

  if (trimmedName.length === 0) errors.name = 'Le nom est requis.'
  if (trimmedDraw.length === 0) errors.draw = 'Le dessin est requis.'

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  return {
    errors: {},
    values: {
      name: trimmedName,
      draw: trimmedDraw,
      level: DEFAULT_MONSTER_LEVEL,
      state: DEFAULT_MONSTER_STATE
    }
  }
}
