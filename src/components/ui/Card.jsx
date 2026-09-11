import React from 'react'
import { cn } from '../../utils/helpers.js'

export function Card({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white shadow-sm',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return (
    <div className={cn('px-6 pt-6 pb-2', className)}>
      {children}
    </div>
  )
}

export function CardContent({ className, children }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children }) {
  return (
    <div className={cn('px-6 pb-6 pt-2', className)}>
      {children}
    </div>
  )
}
