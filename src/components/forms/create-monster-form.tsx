'use client'

import { useState } from 'react'
import Button from '../button'
import InputField from '../input'

export const MONSTER_STATES = ['happy', 'sad', 'angry', 'hungry', 'sleepy'] as const

export type MonsterState = typeof MONSTER_STATES[number]

interface FormState {
  name: string
  level: string
  draw: string
  state: MonsterState
}

type FormErrors = Partial<Record<keyof FormState, string>>

export interface CreateMonsterFormValues {
  name: string
  level: number
  draw: string
  state: MonsterState
}

interface CreateMonsterFormProps {
  onSubmit: (values: CreateMonsterFormValues) => void
  onCancel: () => void
}

const createDefaultFormState = (): FormState => ({
  name: '',
  level: '1',
  draw: '',
  state: MONSTER_STATES[0]
})

function CreateMonsterForm ({ onSubmit, onCancel }: CreateMonsterFormProps): React.ReactNode {
  const [formState, setFormState] = useState<FormState>(createDefaultFormState)
  const [errors, setErrors] = useState<FormErrors>({})

  const hasActiveErrors = Object.values(errors).some((value) => Boolean(value))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const nextErrors: FormErrors = {}
    const trimmedName = formState.name.trim()
    const trimmedDraw = formState.draw.trim()
    const parsedLevel = Number(formState.level.trim())

    if (trimmedName.length === 0) nextErrors.name = 'Le nom est requis.'
    if (Number.isNaN(parsedLevel) || parsedLevel < 1) nextErrors.level = 'Le niveau doit être un nombre positif.'
    if (trimmedDraw.length === 0) nextErrors.draw = 'Le dessin est requis.'
    if (!MONSTER_STATES.includes(formState.state)) nextErrors.state = 'Sélectionnez un état valide.'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const payload: CreateMonsterFormValues = {
      name: trimmedName,
      level: parsedLevel,
      draw: trimmedDraw,
      state: formState.state
    }

    onSubmit(payload)
    setFormState(createDefaultFormState())
    setErrors({})
  }

  const handleCancel = (): void => {
    setFormState(createDefaultFormState())
    setErrors({})
    onCancel()
  }

  return (
    <form className='space-y-6' onSubmit={handleSubmit}>
      <InputField
        label='Nom'
        name='name'
        value={formState.name}
        onChangeText={(value) => {
          setFormState((previous) => ({ ...previous, name: value }))
          if (errors.name !== undefined) setErrors((previous) => ({ ...previous, name: undefined }))
        }}
        error={errors.name}
      />

      <InputField
        label='Niveau'
        name='level'
        type='number'
        value={formState.level}
        onChangeText={(value) => {
          setFormState((previous) => ({ ...previous, level: value }))
          if (errors.level !== undefined) setErrors((previous) => ({ ...previous, level: undefined }))
        }}
        error={errors.level}
      />

      <InputField
        label='Dessin'
        name='draw'
        value={formState.draw}
        onChangeText={(value) => {
          setFormState((previous) => ({ ...previous, draw: value }))
          if (errors.draw !== undefined) setErrors((previous) => ({ ...previous, draw: undefined }))
        }}
        error={errors.draw}
      />

      <div className='flex flex-col space-y-2'>
        <label className='ml-1 text-sm font-medium text-gray-700' htmlFor='monster-state'>
          État émotionnel
        </label>
        <select
          className={`
            w-full rounded-xl border-2 px-4 py-3 bg-white/50 backdrop-blur-sm
            transition-all duration-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-moccaccino-400 focus:border-moccaccino-400
            hover:border-moccaccino-300 hover:bg-white/70
            ${errors.state !== undefined ? 'border-red-400 bg-red-50/50' : 'border-gray-200'}
          `}
          id='monster-state'
          name='state'
          value={formState.state}
          onChange={(event) => {
            const nextState = event.target.value as MonsterState
            setFormState((previous) => ({ ...previous, state: nextState }))
            if (errors.state !== undefined) setErrors((previous) => ({ ...previous, state: undefined }))
          }}
        >
          {MONSTER_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {errors.state !== undefined && (
          <span className='ml-1 text-sm text-red-500'>
            {errors.state}
          </span>
        )}
      </div>

      <div className='flex justify-end gap-3'>
        <Button onClick={handleCancel} type='button' variant='ghost'>
          Annuler
        </Button>
        <Button disabled={hasActiveErrors} type='submit'>
          Créer
        </Button>
      </div>
    </form>
  )
}

export default CreateMonsterForm
