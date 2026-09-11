import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Input from '../components/ui/Input.jsx'
import api from '../api/axios.js'
import { formatDateTime } from '../utils/helpers.js'

export default function AdminCheckInsPage() {
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        params.set('page', page)
        const res = await api.get('/admin/checkins/?' + params.toString())
        if (!cancelled) {
          setCheckins(res.data.results || res.data)
          setTotalPages(res.data.total_pages || 1)
        }
      } catch {
        if (!cancelled) toast.error('Failed to load check-in history.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [search, page])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Check-In History</h1>

      <Input
        placeholder="Search by name or ticket number..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        className="max-w-sm"
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600">Guest</th>
              <th className="px-4 py-3 font-medium text-slate-600">Ticket #</th>
              <th className="px-4 py-3 font-medium text-slate-600">Checked In By</th>
              <th className="px-4 py-3 font-medium text-slate-600">Time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : checkins.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">No check-ins found.</td></tr>
            ) : (
              checkins.map((c, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-800">{c.ticket_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.ticket_number}</td>
                  <td className="px-4 py-3 text-slate-600">{c.checked_in_by || '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(c.checked_in_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={'px-3 py-1 rounded-lg text-sm font-medium ' + (
                page === p ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}