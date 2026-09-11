import React from 'react'
import { useRecoilValue } from 'recoil'
import { eventState } from '../../store/atoms.js'
import { Card, CardContent } from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'
import { formatDate, formatTime } from '../../utils/helpers.js'

export default function EventDetails() {
  const { event, loading } = useRecoilValue(eventState)

  if (loading) {
    return (
      <section className="py-12 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="h-48 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </section>
    )
  }

  if (!event) return null

  return (
    <section className="py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent>
            <h2 className="font-serif text-2xl text-slate-800 mb-6 text-center">
              Service Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <i className="pi pi-calendar text-amber-600 mt-1" />
                <div>
                  <p className="font-medium text-slate-800">Date</p>
                  <p className="text-slate-600">{formatDate(event.event_date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <i className="pi pi-clock text-amber-600 mt-1" />
                <div>
                  <p className="font-medium text-slate-800">Time</p>
                  <p className="text-slate-600">{formatTime(event.start_time)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <i className="pi pi-map-marker text-amber-600 mt-1" />
                <div>
                  <p className="font-medium text-slate-800">Venue</p>
                  <p className="text-slate-600">{event.venue}</p>
                  <p className="text-slate-500 text-sm">{event.address}</p>
                  {event.map_url && (
                    <a
                      href={event.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 text-sm font-medium mt-1 inline-flex items-center gap-1"
                    >
                      View on map <i className="pi pi-external-link text-xs" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            {typeof event.remaining_capacity === 'number' && (
              <div className="mt-6 flex justify-center">
                <Badge variant={event.remaining_capacity > 10 ? 'info' : 'warning'}>
                  {event.remaining_capacity} seats remaining
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
