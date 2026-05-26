import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Coffee } from 'lucide-react'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', email: '', senha: '', telefone: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register({ ...form, role: 'CLIENTE' })
      navigate('/')
    } catch {}
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-espresso mb-1.5">{label}</label>
      <input
        type={type} required placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm({...form, [key]: e.target.value})}
        className="input-field"
      />
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{background: 'linear-gradient(135deg, #fdf8f0 0%, #faefd9 100%)'}}>
      <div className="card p-8 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cafe-600 rounded-2xl mb-4">
            <Coffee size={30} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-espresso">Crie sua conta</h1>
          <p className="text-mocha mt-2">Junte-se à família Cafeteria RM ☕</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field('nome', 'Nome completo', 'text', 'Seu nome')}
          {field('email', 'E-mail', 'email', 'seu@email.com')}
          {field('senha', 'Senha', 'password', '••••••••')}
          {field('telefone', 'Telefone', 'tel', '(11) 99999-9999')}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60">
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-mocha mt-6 text-sm">
          Já tem conta?{' '}
          <Link to="/login" className="text-cafe-600 hover:text-cafe-700 font-semibold">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
