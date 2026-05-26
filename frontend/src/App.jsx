import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/ui/ProtectedRoute'
import ChatBot from './components/ui/ChatBot'
import MusicPlayer from './components/ui/MusicPlayer'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CardapioPage from './pages/CardapioPage'
import CarrinhoPage from './pages/CarrinhoPage'
import MeusPedidosPage from './pages/MeusPedidosPage'
import AdminPage from './pages/admin/AdminPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cardapio" element={<CardapioPage />} />
              <Route path="/carrinho" element={<ProtectedRoute><CarrinhoPage /></ProtectedRoute>} />
              <Route path="/meus-pedidos" element={<ProtectedRoute><MeusPedidosPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute roles={['ADMIN','ATENDENTE']}><AdminPage /></ProtectedRoute>} />
            </Routes>
          </main>
          <footer className="bg-espresso text-cafe-300 py-6 px-4 text-center text-sm">
            <p className="font-display text-cafe-400 text-base mb-1">Cafeteria RM</p>
            <p>© {new Date().getFullYear()} — Feito com ☕ e muito amor</p>
          </footer>
        </div>

        <MusicPlayer />
        <ChatBot />

        <Toaster position="top-right" toastOptions={{
          style: { background: '#2C1810', color: '#faefd9', borderRadius: '12px' },
          success: { iconTheme: { primary: '#d4791f', secondary: '#fff' } },
        }} />
      </BrowserRouter>
    </AuthProvider>
  )
}