import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Coffee, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await login(form.email, form.senha)
      navigate(data.role === 'ADMIN' ? '/admin' : '/')
    } catch {}
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{background: 'linear-gradient(135deg, #fdf8f0 0%, #faefd9 100%)'}}>
      <div className="card p-8 w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cafe-600 rounded-2xl mb-4">
            <Coffee size={30} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-espresso">Bem-vindo de volta!</h1>
          <p className="text-mocha mt-2">Entre na sua conta para fazer pedidos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-espresso mb-1.5">E-mail</label>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-espresso mb-1.5">Senha</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={form.senha}
                onChange={e => setForm({...form, senha: e.target.value})}
                className="input-field pr-12"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mocha hover:text-espresso">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Entrando...' : 'Entrar ☕'}
          </button>
        </form>

        <p className="text-center text-mocha mt-6 text-sm">
          Não tem conta?{' '}
          <Link to="/register" className="text-cafe-600 hover:text-cafe-700 font-semibold">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
