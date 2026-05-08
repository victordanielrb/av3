import { createContext, useContext, useState } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    return token ? decodeToken(token) : null
  })

  async function login(usuario, senha) {
    try {
      const { token } = await authApi.login(usuario, senha)
      localStorage.setItem('token', token)
      setUser(decodeToken(token))
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
