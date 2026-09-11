import React from 'react'
import { cn } from '../../utils/helpers.js'

export default function StatCard({ title, value, iconClass, trend, trendUp }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
          {trend !== undefined && (
            <p
              className={cn(
                'mt-1 text-sm font-medium',
                trendUp ? 'text-emerald-600' : 'text-rose-600'
              )}
            >
              {trendUp ? '+' : ''}{trend}
            </p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-slate-100">
          <i className={cn('text-xl text-slate-600', iconClass)} />
        </div>
      </div>
    </div>
  )
}
