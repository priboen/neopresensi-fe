import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  uuid: string
  name: string
  username: string
  email: string
  role: string
  face_embedding: string | null
  photo_url: string
  createdAt: string
  updatedAt: string
}

type AuthState = {
  user: User | null
  token: string | null
  login: (data: { user: User; token: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: ({ user, token }) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)