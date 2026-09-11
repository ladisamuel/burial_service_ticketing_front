import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { eventState } from '../store/atoms.js'
import MemorialHeader from '../components/public/MemorialHeader.jsx'
import PhotoMarquee from '../components/public/PhotoMarquee.jsx'
import EventDetails from '../components/public/EventDetails.jsx'
import TributeForm from '../components/public/TributeForm.jsx'
import TributesWall from '../components/public/TributesWall.jsx'
import TicketCard from '../components/public/TicketCard.jsx'
import api from '../api/axios.js'

export default function Tribute() {
  const setEvent = useSetRecoilState(eventState)

  useEffect(() => {
    let cancelled = false
    const fetchEvent = async () => {
      try {
        const res = await api.get('/event/')
        if (!cancelled) {
          setEvent({ event: res.data, loading: false, error: null })
        }
      } catch (err) {
        if (!cancelled) {
          setEvent({ event: null, loading: false, error: err.message })
        }
      }
    }
    fetchEvent()
    return () => { cancelled = true }
  }, [setEvent])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* <MemorialHeader /> */}
      <PhotoMarquee />
      <TributeForm />
      <EventDetails />
      {/* <TributesWall /> */}
      <TicketCard />
    </div>
  )
}
