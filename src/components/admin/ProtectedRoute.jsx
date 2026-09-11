import React from 'react'
import { Navigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { authState } from '../../store/atoms.js'
import AdminLayout from './AdminLayout.jsx'

export default function ProtectedRoute({ children }) {
  const auth = useRecoilValue(authState)

  if (!auth.isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <AdminLayout>{children}</AdminLayout>
}
