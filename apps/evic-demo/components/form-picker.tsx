import { forwardRef, useState } from 'react'
import type { UseFormSetValue } from 'react-hook-form'

import type { IProjectCreateForm } from '@/types/project.types'
import type { InputProps } from './ui/input'
import { covers } from '@/demo/covers'

interface PickerProps extends InputProps {
  setPath: UseFormSetValue<IProjectCreateForm>
}

export const FormPicker = forwardRef<HTMLInputElement, PickerProps>(({ setPath }, _ref) => {
  const [selected, setSelected] = useState('')

  return (
    <div className="grid grid-cols-3 gap-2 mb-2" aria-label="Board cover">
      {covers.map(cover => (
        <button
          key={cover.id}
          type="button"
          aria-label={cover.name}
          aria-pressed={selected === cover.id}
          className={selected === cover.id
            ? 'relative aspect-video rounded-sm border-2 border-sky-500'
            : 'relative aspect-video rounded-sm border-2 border-transparent'}
          onClick={() => {
            setSelected(cover.id)
            setPath('imagePath', [cover.id, cover.url, cover.url, '#/team', 'Evic demo'].join('|'), { shouldValidate: true })
          }}
        >
          <img src={cover.url} alt={cover.name} className="w-full h-full object-cover rounded-sm" />
        </button>
      ))}
    </div>
  )
})

FormPicker.displayName = 'FormPicker'
