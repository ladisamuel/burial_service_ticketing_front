import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RequestTicketPage from './pages/RequestTicketPage.jsx'
import EditTicketPage from './pages/EditTicketPage.jsx'
import LookupPage from './pages/LookupPage.jsx'
import TicketPage from './pages/TicketPage.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import AdminTicketsPage from './pages/AdminTicketsPage.jsx'
import AdminTributePage from './pages/AdminTributePage.jsx'
import AdminCheckInPage from './pages/AdminCheckInPage.jsx'
import AdminCheckInsPage from './pages/AdminCheckInsPage.jsx'
import AdminGalleryPage from './pages/AdminGalleryPage.jsx'
import AdminAnnouncementsPage from './pages/AdminAnnouncementsPage.jsx'
import ProtectedRoute from './components/admin/ProtectedRoute.jsx'
import Tribute from './pages/Tribute.jsx'
import HomePage from './pages/HomePage.jsx'
import HomePage2 from './pages/HomePage2.jsx'
import UserLayout from './components/admin/UserLayout.jsx'
import GalleryPage from './pages/GalleryPage.jsx'

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<UserLayout><HomePage/></UserLayout>} />
      <Route path="/chk" element={<UserLayout><HomePage2/></UserLayout>} />
      <Route path="/gallery" element={<UserLayout><GalleryPage/></UserLayout>} />
      <Route path="/share-memory" element={<UserLayout><Tribute /></UserLayout>} />
      <Route path="/request-ticket" element={<UserLayout><RequestTicketPage /></UserLayout>} />
      <Route path="/edit-ticket" element={<UserLayout><EditTicketPage /></UserLayout>} />
      <Route path="/lookup" element={<UserLayout><LookupPage /></UserLayout>} />
      <Route path="/ticket/:ticketNumber" element={<UserLayout><TicketPage /></UserLayout>} />
      <Route path="*" element={<UserLayout><HomePage/></UserLayout>} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
      <Route path="/admin/tickets" element={<ProtectedRoute><AdminTicketsPage /></ProtectedRoute>} />
      <Route path="/admin/tributes" element={<ProtectedRoute><AdminTributePage /></ProtectedRoute>} />
      <Route path="/admin/checkin" element={<ProtectedRoute><AdminCheckInPage /></ProtectedRoute>} />
      <Route path="/admin/checkins" element={<ProtectedRoute><AdminCheckInsPage /></ProtectedRoute>} />
      <Route path="/admin/gallery" element={<ProtectedRoute><AdminGalleryPage /></ProtectedRoute>} />
      <Route path="/admin/announcements" element={<ProtectedRoute><AdminAnnouncementsPage /></ProtectedRoute>} />
    </Routes>
  )
}