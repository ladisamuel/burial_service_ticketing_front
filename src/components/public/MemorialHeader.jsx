import React from 'react'
import { useRecoilValue } from 'recoil'
import { eventState } from '../../store/atoms.js'
import { formatDate } from '../../utils/helpers.js'

export default function MemorialHeader() {
  const { event, loading } = useRecoilValue(eventState)

  if (loading) {
    return (
      <section className="relative w-full bg-slate-900 py-24 px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="h-12 w-64 bg-slate-700 rounded animate-pulse mx-auto mb-4" />
          <div className="h-6 w-48 bg-slate-700 rounded animate-pulse mx-auto" />
        </div>
      </section>
    )
  }

  const memorial = event?.memorial
  const coverPhoto = memorial?.cover_photo_url

  return (
    <section
      className="relative w-full py-24 px-4 text-center overflow-hidden"
      style={
        coverPhoto
          ? {
              backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.95), rgba(15,23,42,0.7), transparent), url(${coverPhoto})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { backgroundColor: '#0f172a' }
      }
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white mb-4 tracking-tight">
          {memorial?.name || 'In Loving Memory'}
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-2">
          {memorial?.birth_date && memorial?.death_date
            ? `${formatDate(memorial.birth_date)} — ${formatDate(memorial.death_date)}`
            : ''}
        </p>
        {memorial?.epitaph && (
          <p className="mt-6 text-xl md:text-2xl italic text-amber-400 font-serif">
            "{memorial.epitaph}"
          </p>
        )}
      </div>
    </section>
  )
}
