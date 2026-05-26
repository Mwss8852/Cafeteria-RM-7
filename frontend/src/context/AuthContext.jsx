import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/services'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, senha) => {
    setLoading(true)
    try {
      const { data } = await authAPI.login({ email, senha })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      toast.success(`Bem-vindo(a), ${data.nome}! ☕`)
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao fazer login')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const { data } = await authAPI.register(payload)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      toast.success('Conta criada com sucesso! ☕')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao criar conta')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Até logo! 👋')
  }

  const isAdmin = user?.role === 'ADMIN'
  const isAtendente = user?.role === 'ATENDENTE'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAtendente }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
