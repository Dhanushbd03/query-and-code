import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import createApi from "@/api/axios"

const admin_api = createApi("api/admin")

interface AdminAuthState {
  is_authenticated: boolean
  admin_email: string | null
  set_is_authenticated: (value: boolean) => void
  set_admin_email: (email: string | null) => void
  signin: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      is_authenticated: false,
      admin_email: null,
      set_is_authenticated: (value) => set({ is_authenticated: value }),
      set_admin_email: (email) => set({ admin_email: email }),
      signin: async (email: string, password: string) => {
        try {
          const response = await admin_api.post("/login", { email, password })
          
          if (response.data.success) {
            set({ is_authenticated: true, admin_email: email })
            return { success: true }
          } else {
            return { 
              success: false, 
              message: response.data.message || "Invalid email or password" 
            }
          }
        } catch (err: any) {
          return { 
            success: false, 
            message: err.response?.data?.message || "An error occurred. Please try again." 
          }
        }
      },
      logout: () => {
        set({ is_authenticated: false, admin_email: null })
      },
    }),
    {
      name: 'admin-auth-storage',
    }
  )
) 