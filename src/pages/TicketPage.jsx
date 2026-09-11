import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { eventState } from '../store/atoms.js'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { formatDate, formatTime } from '../utils/helpers.js'
import api from '../api/axios.js'

export default function TicketPage() {
  const { ticketNumber } = useParams()
  const { event } = useRecoilValue(eventState)
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    let cancelled = false
    const fetchTicket = async () => {
      try {
        const res = await api.get('/tickets/' + ticketNumber + '/')
        if (!cancelled) setTicket(res.data)
        console.log(res.data)
      } catch {
        if (!cancelled) setTicket(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchTicket()
    return () => { cancelled = true }
  }, [ticketNumber])

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  const qrUrl = ticket?.qr_code
    ? (ticket?.qr_code.startsWith('http') ? ticket?.qr_code : baseUrl + ticket?.qr_code)
    : null

  // const handleDownloadPdf = () => {
  //   window.open(baseUrl + '/api/tickets/' + ticketNumber + '/pdf/', '_blank')
  // }

  // const handleDownloadPdf = () => {
  //   const url = `${baseUrl}/api/tickets/${ticketNumber}/pdf/`

  //   const link = document.createElement('a')
  //   link.href = url
  //   link.setAttribute('download', `ticket_${ticketNumber}.pdf`)
  //   document.body.appendChild(link)
  //   link.click()
  //   link.remove()
  // }


  // with axios
  const handleDownloadPdf = async () => {
    try {
      const response = await api.get(
        `/tickets/${ticketNumber}/pdf/`,
        {
          responseType: 'blob',
        }
      )

      const blob = new Blob([response.data], {
        type: 'application/pdf',
      })

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `ticket_${ticketNumber}.pdf`

      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download ticket PDF:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <i className="pi pi-spinner pi-spin text-3xl text-amber-600" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <i className="pi pi-times-circle text-5xl text-rose-400 mb-4" />
          <h1 className="text-xl font-semibold text-slate-800">Ticket Not Found</h1>
          <p className="text-slate-500 mt-2">The ticket number you entered is invalid.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="bg-slate-900 rounded-t-xl p-6 text-center">
          <p className="text-amber-400 text-sm font-medium mb-1">In Loving Memory <span className='text-xs italic'>of</span></p>
          <h1 className="font-serif text-xl text-white">
            {ticket?.event_name || 'Memorial Service'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{formatDate(ticket?.event_date)}</p>
        </div>

        {/* Ticket body */}
        <div className="bg-white border-x border-b border-slate-200 rounded-b-xl shadow-sm p-6 md:p-8 text-center">
          {
            ticket.status.toLowerCase() === 'approved' ?
              <Badge variant="success" className="mb-4">Approved</Badge> :
              ticket.status.toLowerCase() === 'pending' ?
                <Badge variant="warning" className="mb-4">Pending</Badge> :
                <Badge variant="danger" className="mb-4">Declined</Badge>
          }
          <h2 className="text-lg font-semibold text-slate-800 mb-1">
            {ticket.name}
          </h2>
          <p className="font-mono text-2xl font-bold text-slate-800 tracking-widest mb-6">
            {ticket.ticket_number}
          </p>

          {qrUrl && (
            <div className="mb-6 flex justify-center">
              <img
                src={ticket?.qr_code}
                alt="Ticket QR Code"
                className="w-48 h-48 rounded-lg border border-slate-200"
              />
            </div>
          )}



          {ticket.status === 'PENDING' && (
            <p className="text-sm text-amber-700 bg-amber-50 mb-2 rounded-lg px-4 py-3">
              Your request is still under review. You will receive an email once it is processed.
            </p>
          )}

          {ticket.status === 'DECLINED' && (
            <p className="text-sm text-rose-700 bg-rose-50 mb-2 rounded-lg px-4 py-3">
              We regret to inform you that your request could not be accommodated.
              {ticket.notes && <span className="block mt-1 text-rose-600">Note: {ticket.notes}</span>}
            </p>
          )}

          <div className="space-y-2 text-sm text-slate-600 mb-6">
            <p className='w-[80%] m-auto'><i className="pi pi-map-marker mr-1" /> {ticket?.address}</p>
            <p><i className="pi pi-clock mr-1" />
              {formatTime(ticket?.start_time)} - {formatTime(ticket?.end_time)}
            </p>
            {ticket.number_of_guests > 1 && (
              <p><i className="pi pi-users mr-1" /> {ticket.number_of_guests} guests</p>
            )}
          </div>

          <Button onClick={handleDownloadPdf} variant="outline" className="w-full">
            <i className="pi pi-download mr-2" />
            Download PDF
          </Button>
        </div>

        <div className="p-5 flex justify-between border">
          <button
            onClick={() => navigate(`/edit-ticket/`, {state: ticket})}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg text-xs tracking-[0.15em] uppercase hover:bg-[#8A7F6A] transition-colors"
          >
            Verify or edit info
          </button>
          <button
            onClick={() => navigate('/lookup')}
            className="px-4 py-2 bg-[#B4652F] text-white rounded-lg text-xs tracking-[0.15em] uppercase hover:bg-[#8A7F6A] transition-colors"
          >
            Look up a ticket
          </button>
        </div>
      </div>
    </div>
  )
}
