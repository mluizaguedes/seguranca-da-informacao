import React from 'react'
import { Navigate } from 'react-router-dom'

export function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  // Se não tiver token, redireciona para /login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && (!user || !user.isAdmin)) {
    return <Navigate to="/perfil" replace />
  }

  return children
}