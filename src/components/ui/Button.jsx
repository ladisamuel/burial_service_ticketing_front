import React from 'react'
import { cn } from '../../utils/helpers.js'

const variantClasses = {
  primary: 'bg-amber-600 hover:bg-amber-700 text-white',
  secondary: 'bg-slate-800 hover:bg-slate-900 text-white',
  outline: 'border-2 border-amber-600 text-amber-600 hover:bg-amber-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...rest
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && <i className="pi pi-spinner pi-spin mr-2" />}
      {children}
    </button>
  )
}
