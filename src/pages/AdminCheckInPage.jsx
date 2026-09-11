import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import { checkInState } from '../store/atoms.js'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import api from '../api/axios.js'
import { formatDateTime } from '../utils/helpers.js'

export default function AdminCheckInPage() {
  const [ticketNumber, setTicketNumber] = useState('')
  const [state, setState] = useRecoilState(checkInState)
  const inputRef = useRef(null)

  const fetchRecent = useCallback(async () => {
    try {
      const res = await api.get('/admin/checkins/')
      setState(prev => ({ ...prev, recent: res.data.results || res.data }))
    } catch {
      // silent
    }

  }, [setState])

  useEffect(() => {
    fetchRecent()
    const interval = setInterval(fetchRecent, 10000)
    return () => clearInterval(interval)
  }, [fetchRecent])

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  useEffect(() => {
    if (state.lastResult) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, lastResult: null }))
        if (inputRef.current) inputRef.current.focus()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [state.lastResult, setState])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!ticketNumber.trim()) return
    setState(prev => ({ ...prev, loading: true }))
    try {
      const res = await api.post('/admin/checkin/', { ticket_number: ticketNumber.trim().toUpperCase() })
      setState(prev => ({
        ...prev,
        lastResult: { success: true, ...res.data },
        loading: false,
      }))
      toast.success('Check-in successful.')
      fetchRecent()
    } catch (err) {
      const msg = err.response?.data?.detail || 'Check-in failed.'
      setState(prev => ({
        ...prev,
        lastResult: { success: false, message: msg },
        loading: false,
      }))
      toast.error(msg)
    }
    setTicketNumber('')
    if (inputRef.current) inputRef.current.focus()
  }

  const result = state.lastResult
  const resultColor = result?.success
    ? (result.checked_in_at ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200')
    : 'bg-rose-50 border-rose-200'

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800">Check-In Desk</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          ref={inputRef}
          label="Ticket Number"
          placeholder="Enter ticket number..."
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
          className="font-mono text-2xl py-4"
          autoComplete="off"
        />
        <Button type="submit" isLoading={state.loading} size="lg" className="w-full">
          Check In
        </Button>
      </form>

      {result && (
        <div className={'rounded-xl border-2 p-6 text-center ' + resultColor}>
          {result.success ? (
            <>
              <i className={result.checked_in_at ? "pi pi-exclamation-circle text-4xl text-amber-500 mb-3" : "pi pi-check-circle text-4xl text-emerald-500 mb-3"} />
              <h2 className="text-xl font-semibold text-slate-800">
                {result.attendee?.name || 'Guest'}
              </h2>
              <p className="text-slate-600 mt-1">
                {result.checked_in_at
                  ? 'Already checked in at ' + result.checked_in_at
                  : 'Checked in successfully'}
              </p>
            </>
          ) : (
            <>
              <i className="pi pi-times-circle text-4xl text-rose-500 mb-3" />
              <h2 className="text-xl font-semibold text-slate-800">Invalid Ticket</h2>
              <p className="text-slate-600 mt-1">{result.message}</p>
            </>
          )}
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Check-Ins</h2>
        {state.recent.length === 0 ? (
          <p className="text-slate-500">No check-ins yet.</p>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Guest</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Ticket #</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Time</th>
                </tr>
              </thead>
              <tbody>
                {state.recent.map((c, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-4 py-3 text-slate-800">{c.ticket_name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.ticket_number}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDateTime(c.checked_in_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}