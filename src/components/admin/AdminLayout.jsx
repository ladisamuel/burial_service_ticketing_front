import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { toast } from 'react-toastify'
import { authState } from '../../store/atoms.js'
import { cn } from '../../utils/helpers.js'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: 'pi pi-chart-bar' },
  { path: '/admin/tributes', label: 'Tributes', icon: 'pi pi-bell' },
  { path: '/admin/tickets', label: 'Tickets', icon: 'pi pi-ticket' },
  { path: '/admin/checkin', label: 'Check-In', icon: 'pi pi-check-square' },
  { path: '/admin/checkins', label: 'History', icon: 'pi pi-list' },
  { path: '/admin/gallery', label: 'Gallery', icon: 'pi pi-images' },
  { path: '/admin/announcements', label: 'Announcements', icon: 'pi pi-send' },
]

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [auth, setAuth] = useRecoilState(authState)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setAuth({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false })
    toast.info('Signed out.')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="px-6 py-5 border-b border-slate-100">
          <h1 className="text-lg font-bold text-slate-800">Admin Panel</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition',
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                <i className={item.icon} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 truncate">
              {auth.user?.username || 'Admin'}
            </span>
            <button
              onClick={handleSignOut}
              className="text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <h1 className="font-semibold text-slate-800">Admin</h1>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <i className="pi pi-bars text-lg" />
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
        <footer className='h-12 bg-white flex justify-end items-center font-bold pr-10'>
          <p>Amos Iyiola Ladipo</p>
        </footer>
      </div>
    </div>
  )
}
