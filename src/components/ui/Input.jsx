import React, { forwardRef } from 'react'
import { cn } from '../../utils/helpers.js'

const Input = forwardRef(function Input(
  { label, error, className, ...rest },
  ref
) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-lg border px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition',
          error
            ? 'border-rose-300 focus:ring-rose-500'
            : 'border-slate-300'
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
    </div>
  )
})

export default Input
