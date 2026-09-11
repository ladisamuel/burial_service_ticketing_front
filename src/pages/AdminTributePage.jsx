import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import { adminTributeState } from '../store/atoms.js'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import Badge from '../components/ui/Badge.jsx'
import Modal from '../components/ui/Modal.jsx'
import api from '../api/axios.js'
import { formatDateTime } from '../utils/helpers.js'

export default function AdminTributePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, setState] = useRecoilState(adminTributeState)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [declineModal, setDeclineModal] = useState({ open: false, ticketId: null, notes: '' })
  const [activeTribute, setActiveTribute] = useState({})
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
    const res = await api.get('/tributes/admin/tribute/?' + params.toString())
    

// ID
// Name
// Email
// Message
//  1 
// Relationship
// Status
// Visibility

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
    console.log('whos', id)
    try {
      const update = {
        status: 'approved',
        visibility: 'public',
      }
      await api.patch(`/tributes/admin/tribute/${id}/`, update)
      toast.success('Tribute approved.')
      fetchTickets()
    } catch {
      toast.error('Failed to approve tribute.')
    }
  }

  const handleUpdate = async () => {
    try { 
      await api.patch(`/tributes/admin/tribute/${activeTribute.id}/`, activeTribute)
      toast.success('Tribute updated.')
      fetchTickets()
      setDeclineModal({ open: false, ticketId: null, notes: '' })
    } catch {
      toast.error('Failed to update .tribute')
    }
  }

  const handleDecline = async (id) => {
    // if (!declineModal.ticketId) return
    try {
      
      const update = {
        status: 'declined',
        visibility: 'private',
      }
      // await api.patch('/tickets/admin/tickets/' + declineModal.ticketId + '/decline/', {
      //   notes: declineModal.notes,
      // })
      await api.patch(`/tributes/admin/tribute/${id}/`, update)
      toast.success('Tribute declined.')
      // setDeclineModal({ open: false, ticketId: null, notes: '' })
      fetchTickets()
    } catch {
      toast.error('Failed to decline tribute.')
    }
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
              <th className="px-4 py-3 font-medium text-slate-600">Referral</th>
              <th className="px-4 py-3 font-medium text-slate-600">Relationship</th>
              {/* <th className="px-4 py-3 font-medium text-slate-600">Ticket #</th>
              */}
              <th className="px-4 py-3 font-medium text-slate-600">View</th> 
              <th className="px-4 py-3 font-medium text-slate-600">Date</th>
              <th className="px-4 py-3 font-medium text-slate-600">Visibility</th>
              <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {console.log('state', state)}
            {state.loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
            ) : state.tickets.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-400">No tickets found.</td></tr>
            ) : (
              state.tickets.map(t => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-800">{t.name}</td>
                  <td className="px-4 py-3 text-slate-600">{t.email}</td>
                  <td className="px-4 py-3 text-slate-600">{t.referral ? t.referral:'-'}</td>
                  <td className="px-4 py-3 text-slate-600">{t.relationship}</td>
                  <td className="px-4 py-3">
                    {/* {t.checked_in ? <i className="pi pi-check text-emerald-600" /> : '-'} */}
                    <span
                    onClick={() => 
                      {
                        setActiveTribute(t)
                        setDeclineModal({ open: true, ticketId: t.id, notes: '' })
                      }
                    }
                    // href={'/ticket/' + t.reference} 
                    // target="_blank" rel="noreferrer" 
                    className="cursor-pointer text-amber-600 hover:underline text-sm"
                    >
                        View
                      </span>
                    </td> 
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{formatDateTime(t.created_at)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={
                      t?.visibility?.toLowerCase() === 'public' ? 'success' :
                      t?.visibility?.toLowerCase() === 'private' ? 'danger' : 'warning'
                    }>
                      {t.visibility}
                    </Badge>
                  </td>
                  {/* <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.ticket_number || '-'}</td>
                  */}
                  <td className="px-4 py-3">
                    {t?.visibility?.toLowerCase() === 'private' && (
                      <div className="flex gap-2">
                        <Button size="sm" 
                        onClick={() => handleApprove(t.id)}
                        >Approve</Button>
                      </div>
                    )}
                      {/* <a href={'/ticket/' + t.ticket_number} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline text-sm"> */}
                    
                    {t.visibility === 'public' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant='danger' onClick={() => handleDecline(t.id)}>Decline</Button>
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

      {state.totalPages >  1 && (
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
        title="View Tribute"
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500">
              {formatDateTime(activeTribute.created_at)}
            </p>
          </div>

          <div className='flex gap-3'>
            <p className="text-md font-bold text-gray-700">Name</p>
            <p className="text-md text-gray-500">
              {activeTribute.name}
            </p>
          </div>



          <div className='flex gap-3'>
            <p className="text-md font-bold text-gray-700">Email</p>
            <p className="text-md text-gray-500">
              {activeTribute.email}
            </p>
          </div>

          <div className='flex gap-3'>
            <p className="text-md font-bold text-gray-700">Referral</p>
            <p className="text-md text-gray-500">
              {activeTribute.referral}
            </p>
          </div>
          <div className='flex gap-3'>
            <p className="text-md font-bold text-gray-700">Relationship</p>
            <p className="text-md text-gray-500">
              {activeTribute.relationship}
            </p>
          </div>

          <div className='flex gap-3'>
            <p className="text-md font-bold text-gray-700">Visibility</p>
            <p className="text-md text-gray-500">
              {activeTribute.visibility}
            </p>
          </div>

          <div className='flex gap-3'>
            <p className="text-md font-bold text-gray-700">Status</p>
            <p className="text-md text-gray-500">
              {activeTribute.status}
            </p>
          </div>

          <textarea
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Optional notes for the guest..."
            rows={3}
            value={activeTribute.message}
            onChange={(e) => setActiveTribute(prev => ({ ...prev, message: e.target.value }))}
          />
            <Button size='sm' variant="outline" 
              onClick={handleUpdate}
            >Update</Button>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeclineModal({ open: false, ticketId: null, notes: '' })}>Cancel</Button>
            <Button variant="primary" 
              onClick={() => handleApprove(activeTribute.id)}
            >Approve</Button>
            <Button variant="danger" 
              onClick={() => handleDecline(activeTribute.id)}
            >Decline</Button>

{/* 
      created_at:"2026-08-19T21:41:14.641123Z"
      email:"ladisamuel00@gmail.com"
      id:3
      image:null
      message:"Beautifully made in Christ"
      name:"Ifeoluwa Ladipo"
      relationship:"Son"
      status:"pending"
      updated_at:"2026-08-19T21:41:54.315730Z"
      visibility:"public
*/}
          </div>
        </div>
      </Modal>
    </div>
  )
}