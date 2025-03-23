import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuthStore } from '@/stores/logic/adminAuthStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate()
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/signin')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
} 