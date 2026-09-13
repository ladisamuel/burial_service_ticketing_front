import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import { adminTicketState } from '../store/atoms.js'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import Badge from '../components/ui/Badge.jsx'
import Modal from '../components/ui/Modal.jsx'
import api from '../api/axios.js'
import { formatDate, formatDateTime } from '../utils/helpers.js'

export default function AdminTicketsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, setState] = useRecoilState(adminTicketState)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [declineModal, setDeclineModal] = useState({ open: false, ticketId: null, notes: '' })
  const [loading, setLoading] = useState({loading: false, type: '', id: null})

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'declined', label: 'Declined' },
  ]

  const fetchTickets = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }))
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (search) params.set('search', search)
    params.set('page', state.currentPage)
  try {
    // const res = await api.get('/tickets/admin/tickets/?' )
    const res = await api.get('/tickets/admin/tickets/?' + params.toString())
    
    console.log('\n\n\nres data', res.data)
      
      setState(prev => ({
        ...prev,
        tickets: res.data.results || res.data,
        totalPages: res.data.total_pages || 1,
        loading: false,
      }))
    } catch {
      toast.error('Failed to load tickets.')
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [statusFilter, search, state.currentPage, setState])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (search) params.set('search', search)
    setSearchParams(params)
    setState(prev => ({ ...prev, currentPage: 1 }))
    fetchTickets()
  }

  const handleApprove = async (id) => {
    setLoading({ loading: true, type: 'approved', id: id })
    try {
      await api.patch('/tickets/admin/tickets/' + id + '/approve/')
      toast.success('Ticket approved.')
      fetchTickets()
      setLoading({ loading: false, type: '', id: null })
    } catch {
      toast.error('Failed to approve ticket.')
    }
    setLoading({ loading: false, type: '', id: null })
  }
  
  const handleDecline = async () => {
    setLoading({ loading: true, type: 'declined', id: null })
    if (!declineModal.ticketId) return
    try {
      await api.patch('/tickets/admin/tickets/' + declineModal.ticketId + '/decline/', {
        notes: declineModal.notes,
      })
      toast.success('Ticket declined.')
      setDeclineModal({ open: false, ticketId: null, notes: '' })
      fetchTickets()
    } catch {
      toast.error('Failed to decline ticket.')
    }
    setLoading({ loading: false, type: '', id: null })
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Ticket Management</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search name, email, reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="sm:max-w-xs"
        />
        <Button onClick={applyFilters}>Filter</Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600">Name</th>
              <th className="px-4 py-3 font-medium text-slate-600">Email</th>
              <th className="px-4 py-3 font-medium text-slate-600">Guests</th>
              <th className="px-4 py-3 font-medium text-slate-600">Phone</th>
              <th className="px-4 py-3 font-medium text-slate-600">Request date</th>
              <th className="px-4 py-3 font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 font-medium text-slate-600">Reference</th>
              <th className="px-4 py-3 font-medium text-slate-600">Ticket #</th>
              <th className="px-4 py-3 font-medium text-slate-600">Checked In</th>
              <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : state.tickets.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">No tickets found.</td></tr>
            ) : (
              state.tickets.map(t => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-800">{t.name}</td>
                  <td className="px-4 py-3 text-slate-600">{t.email}</td>
                  <td className="px-4 py-3 text-slate-600">{t.number_of_guests}</td>
                  <td className="px-4 py-3 text-slate-600">{t.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(t.created_at)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      t.status === 'APPROVED' ? 'success' :
                      t.status === 'DECLINED' ? 'danger' : 'warning'
                    }>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.reference}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.ticket_number || '-'}</td>
                  <td className="px-4 py-3">
                    {t.checked_in ? <i className="pi pi-check text-emerald-600" /> : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {t.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(t.id)}>
                          {loading.loading && loading.type === 'approved' && loading.id === t.id ? <i className="pi pi-spin pi-spinner" /> : 'Approve'}
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setDeclineModal({ open: true, ticketId: t.id, notes: '' })}>
                          
                          
                          {loading.loading && loading.type === 'declined' ? <i className="pi pi-spin pi-spinner" /> : 'Decline'}
                        </Button>
                      </div>
                    )}
                      {/* <a href={'/ticket/' + t.ticket_number} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline text-sm"> */}
                    {t.status === 'APPROVED' && t.ticket_number && (
                      <a href={'/ticket/' + t.reference} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline text-sm">
                        View
                      </a>
                    )}
                    {/*  */}
                    {t.status === 'DECLINED' && t.notes || t.status === 'DECLINED' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(t.id)}>
                          {loading.loading && loading.type === 'approved' && loading.id === t.id ? <i className="pi pi-spin pi-spinner" /> : 'Approve'}
                        </Button>
                        <span className="text-xs text-slate-500">{t.notes}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {state.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: state.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setState(prev => ({ ...prev, currentPage: page }))}
              className={'px-3 py-1 rounded-lg text-sm font-medium ' + (
                state.currentPage === page
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <Modal
        isOpen={declineModal.open}
        onClose={() => setDeclineModal({ open: false, ticketId: null, notes: '' })}
        title="Decline Ticket"
      >
        <div className="space-y-4">
          <textarea
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Optional notes for the guest..."
            rows={3}
            value={declineModal.notes}
            onChange={(e) => setDeclineModal(prev => ({ ...prev, notes: e.target.value }))}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeclineModal({ open: false, ticketId: null, notes: '' })}>Cancel</Button>
            <Button variant="danger" onClick={handleDecline}>              
              {loading.loading && loading.type === 'declined' ? <i className="pi pi-spin pi-spinner" /> : 'Decline'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}