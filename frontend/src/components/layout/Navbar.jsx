import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Coffee, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCartStore } from '../../store/cartStore'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAdmin, isAtendente } = useAuth()
  const count = useCartStore(s => s.getCount())
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav className="bg-espresso text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-cafe-500 p-2 rounded-xl group-hover:bg-cafe-400 transition-colors">
              <Coffee size={22} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-cafe-200 tracking-wide">
              Cafeteria <span className="text-cafe-400">RM</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/cardapio" className="text-cafe-200 hover:text-cafe-400 transition-colors font-medium text-sm">
              Cardápio
            </Link>
            {user && (
              <Link to="/meus-pedidos" className="text-cafe-200 hover:text-cafe-400 transition-colors font-medium text-sm">
                Meus Pedidos
              </Link>
            )}
            {(isAdmin || isAtendente) && (
              <Link to="/admin" className="text-cafe-200 hover:text-cafe-400 transition-colors font-medium text-sm flex items-center gap-1">
                <LayoutDashboard size={16} />
                Painel
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/carrinho" className="relative p-2 hover:bg-cafe-800 rounded-xl transition-colors">
                  <ShoppingCart size={22} className="text-cafe-200" />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-cafe-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-bounce-in">
                      {count}
                    </span>
                  )}
                </Link>
                <div className="hidden md:flex items-center gap-2 bg-cafe-900 px-3 py-2 rounded-xl">
                  <User size={16} className="text-cafe-400" />
                  <span className="text-sm text-cafe-200 font-medium">{user.nome.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-red-900 rounded-xl transition-colors" title="Sair">
                  <LogOut size={20} className="text-cafe-300" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-cafe-200 hover:text-cafe-400 text-sm font-medium transition-colors px-3 py-2">
                  Entrar
                </Link>
                <Link to="/register" className="bg-cafe-500 hover:bg-cafe-400 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                  Cadastrar
                </Link>
              </div>
            )}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cafe-950 border-t border-cafe-800 px-4 py-4 space-y-3 animate-fade-in">
          <Link to="/cardapio" onClick={() => setMenuOpen(false)} className="block text-cafe-200 hover:text-cafe-400 py-2 font-medium">Cardápio</Link>
          {user && <Link to="/meus-pedidos" onClick={() => setMenuOpen(false)} className="block text-cafe-200 hover:text-cafe-400 py-2 font-medium">Meus Pedidos</Link>}
          {(isAdmin || isAtendente) && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-cafe-200 hover:text-cafe-400 py-2 font-medium">Painel Admin</Link>}
        </div>
      )}
    </nav>
  )
}
