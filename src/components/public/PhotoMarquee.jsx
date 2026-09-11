import React from 'react'
import { useRecoilValue } from 'recoil'
import { eventState } from '../../store/atoms.js'

export default function PhotoMarquee() {
  const { event } = useRecoilValue(eventState)
  const memorial = event?.memorial

  const photos = []
  if (memorial?.cover_photo_url) photos.push(memorial.cover_photo_url)
  if (memorial?.photo_url) photos.push(memorial.photo_url)
  if (memorial?.photos?.length) {
    memorial.photos.forEach((p) => {
      if (!photos.includes(p)) photos.push(p)
    })
  }

  if (photos.length === 0) return null

  const shouldAnimate = photos.length >= 4
  const displayPhotos = shouldAnimate ? [...photos, ...photos] : photos

  return (
    <section className="w-full py-12 bg-slate-50 overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl md:text-3xl text-slate-800">
          A Life in Photos
        </h2>
      </div>
      <div className="w-full overflow-hidden">
        <div
          className={shouldAnimate ? 'marquee-track' : 'flex gap-4 justify-center px-4'}
        >
          {displayPhotos.map((photo, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-64 h-48 md:w-80 md:h-60 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-300"
            >
              <img
                src={photo}
                alt="Memorial"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
