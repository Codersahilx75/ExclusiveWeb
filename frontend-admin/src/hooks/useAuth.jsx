// src/hooks/useAuth.js
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    setIsAuthenticated(!!token)
    
    // Optional: Redirect if not authenticated
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  return { isAuthenticated }
}