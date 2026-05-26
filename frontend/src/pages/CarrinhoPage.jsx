import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { pedidosAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantidade, clearCart, getTotal } = useCartStore()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mesa, setMesa] = useState('')
  const [obs, setObs] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePedir = async () => {
    if (!user) { toast.error('Faça login para continuar'); navigate('/login'); return }
    if (items.length === 0) { toast.error('Carrinho vazio!'); return }

    setLoading(true)
    try {
      const payload = {
        itens: items.map(i => ({ produtoId: i.produto.id, quantidade: i.quantidade })),
        observacao: obs,
        numeroMesa: mesa ? parseInt(mesa) : null,
      }
      const { data } = await pedidosAPI.criar(payload)
      clearCart()
      toast.success('Pedido realizado com sucesso! 🎉')
      navigate('/meus-pedidos')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao realizar pedido')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center animate-slide-up">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-cafe-100 rounded-full mb-6">
            <ShoppingBag size={40} className="text-cafe-400" />
          </div>
          <h2 className="font-display text-3xl font-bold text-espresso mb-3">Carrinho vazio</h2>
          <p className="text-mocha mb-8">Adicione itens do cardápio para continuar</p>
          <Link to="/cardapio" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={18} /> Ver Cardápio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-10 px-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/cardapio" className="p-2 hover:bg-cafe-100 rounded-xl transition-colors">
          <ArrowLeft size={22} className="text-mocha" />
        </Link>
        <h1 className="font-display text-4xl font-bold text-espresso">Seu Carrinho</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ produto, quantidade }) => (
            <div key={produto.id} className="card p-4 flex items-center gap-4 animate-fade-in">
              <img
                src={produto.imagemUrl || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&fit=crop'}
                alt={produto.nome}
                className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                onError={e => e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&fit=crop'}
              />
              <div className="flex-1">
                <h3 className="font-display font-semibold text-espresso">{produto.nome}</h3>
                <p className="text-cafe-600 font-bold">R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantidade(produto.id, quantidade - 1)} className="w-8 h-8 flex items-center justify-center bg-cafe-100 hover:bg-cafe-200 rounded-lg transition-colors">
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-espresso">{quantidade}</span>
                <button onClick={() => updateQuantidade(produto.id, quantidade + 1)} className="w-8 h-8 flex items-center justify-center bg-cafe-100 hover:bg-cafe-200 rounded-lg transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <div className="text-right min-w-[70px]">
                <p className="font-bold text-espresso">R$ {(parseFloat(produto.preco) * quantidade).toFixed(2).replace('.', ',')}</p>
              </div>
              <button onClick={() => removeItem(produto.id)} className="p-2 hover:bg-red-100 rounded-xl text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit sticky top-20">
          <h2 className="font-display text-xl font-bold text-espresso mb-5">Resumo do Pedido</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-espresso mb-1.5">Mesa (opcional)</label>
              <input type="number" placeholder="Nº da mesa" value={mesa} onChange={e => setMesa(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-espresso mb-1.5">Observações</label>
              <textarea placeholder="Alguma observação?" value={obs} onChange={e => setObs(e.target.value)} rows={3} className="input-field resize-none" />
            </div>
          </div>

          <div className="border-t border-cafe-100 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-display text-lg font-semibold text-espresso">Total</span>
              <span className="font-display text-2xl font-bold text-cafe-600">
                R$ {getTotal().toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <button onClick={handlePedir} disabled={loading} className="btn-primary w-full text-lg disabled:opacity-60">
            {loading ? 'Enviando...' : '✓ Confirmar Pedido'}
          </button>
          <button onClick={clearCart} className="w-full text-center text-sm text-red-500 hover:text-red-700 mt-3 transition-colors">
            Limpar carrinho
          </button>
        </div>
      </div>
    </div>
  )
}
