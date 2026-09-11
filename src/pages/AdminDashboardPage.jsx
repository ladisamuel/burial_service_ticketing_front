import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import StatCard from '../components/admin/StatCard.jsx'
import Button from '../components/ui/Button.jsx'
import api from '../api/axios.js'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    const fetchStats = async () => {
      try {
        const res = await api.get('/tickets/admin/dashboard/')
        if (!cancelled) setStats(res.data)
      } catch (err) {
        if (!cancelled) toast.error('Failed to load dashboard stats.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchStats()
    return () => { cancelled = true }
  }, [])

  const handleExport = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    window.open(baseUrl + '/api/tickets/admin/tickets/export/', '_blank')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  const capacityPercent = stats?.max_capacity
    ? Math.round((stats.total_approved_guests / stats.max_capacity) * 100)
    : 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <h3 className="textxl font-bold text-gray-400">Ticket</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Requests" value={stats?.total_requests || 0} iconClass="pi pi-inbox" />
        <StatCard title="Pending" value={stats?.pending_count || 0} iconClass="pi pi-clock" />
        <StatCard title="Approved" value={stats?.approved_count || 0} iconClass="pi pi-check-circle" />
        <StatCard title="Declined" value={stats?.declined_count || 0} iconClass="pi pi-times-circle" />
        <StatCard title="Checked In" value={stats?.checked_in_count || 0} iconClass="pi pi-sign-in" />
      </div>

      <h3 className="textxl font-bold text-gray-400">Tribute</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Tributes" value={stats?.total_tributes || 0} iconClass="pi pi-inbox" />
        <StatCard title="Pending" value={stats?.tributes_pending || 0} iconClass="pi pi-clock" />
        <StatCard title="Approved" value={stats?.tributes_approved || 0} iconClass="pi pi-check-circle" />
        <StatCard title="Declined" value={stats?.tributes_declined || 0} iconClass="pi pi-check-circle" />
      </div>



      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Capacity</h2>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">
            {stats?.total_approved_guests || 0} / {stats?.max_capacity || 0} guests
          </span>
          <span className="text-sm font-medium text-slate-800">{capacityPercent}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-amber-600 h-3 rounded-full transition-all"
            style={{ width: capacityPercent + '%' }}
          />
        </div>
        <p className="text-sm text-slate-500 mt-2">
          {stats?.remaining_capacity || 0} seats remaining
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => navigate('/admin/tickets?status=pending')}>
          <i className="pi pi-clock mr-2" /> Review Pending
        </Button>
        <Button variant="secondary" onClick={() => navigate('/admin/checkin')}>
          <i className="pi pi-check-square mr-2" /> Check-In Desk
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <i className="pi pi-download mr-2" /> Export CSV
        </Button>
      </div>
    </div>
  )
}