import React from 'react'
import { Navigate } from 'react-router-dom'

export function PrivateRoute({ children }) {
  // Pega o token do localStorage (ou de onde você preferir)
  const token = localStorage.getItem('token')

  // Se não tiver token, redireciona para /login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Caso contrário, renderiza o componente “filho”
  return children
}