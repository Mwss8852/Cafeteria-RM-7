import { ShoppingCart, Clock } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import toast from 'react-hot-toast'

const CATEGORIA_COLORS = {
  CAFE:     'bg-amber-100 text-amber-800',
  BEBIDA:   'bg-blue-100 text-blue-800',
  LANCHE:   'bg-orange-100 text-orange-800',
  DOCE:     'bg-pink-100 text-pink-800',
  SALGADO:  'bg-yellow-100 text-yellow-800',
  ESPECIAL: 'bg-purple-100 text-purple-800',
}

const CATEGORIA_LABELS = {
  CAFE:     '☕ Café',
  BEBIDA:   '🥤 Bebida',
  LANCHE:   '🥪 Lanche',
  DOCE:     '🍰 Doce',
  SALGADO:  '🥐 Salgado',
  ESPECIAL: '⭐ Especial',
}

const DEFAULT_IMAGES = {
  CAFE:     'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=450&fit=crop&q=90',
  BEBIDA:   'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=450&fit=crop&q=90',
  LANCHE:   'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=450&fit=crop&q=90',
  DOCE:     'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=450&fit=crop&q=90',
  SALGADO:  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=450&fit=crop&q=90',
  ESPECIAL: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=450&fit=crop&q=90',
}

export default function ProdutoCard({ produto }) {
  const addItem = useCartStore(s => s.addItem)

  const handleAdd = () => {
    addItem(produto)
    toast.success(`${produto.nome} adicionado! ☕`, { duration: 1500 })
  }

  const imageSrc = produto.imagemUrl || DEFAULT_IMAGES[produto.categoria] || DEFAULT_IMAGES.CAFE

  return (
    <div className="card overflow-hidden group">
      {/* Imagem */}
      <div className="relative overflow-hidden h-52">
        <img
          src={imageSrc}
          alt={produto.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = DEFAULT_IMAGES[produto.categoria] || DEFAULT_IMAGES.CAFE }}
        />
        {/* Badge categoria */}
        <div className="absolute top-3 left-3">
          <span className={`badge text-xs font-semibold shadow-sm ${CATEGORIA_COLORS[produto.categoria] || 'bg-gray-100 text-gray-700'}`}>
            {CATEGORIA_LABELS[produto.categoria] || produto.categoria}
          </span>
        </div>
        {/* Overlay indisponível */}
        {!produto.disponivel && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-black/40 px-4 py-2 rounded-xl">Indisponível</span>
          </div>
        )}
        {/* Botão rápido hover */}
        {produto.disponivel && (
          <button
            onClick={handleAdd}
            className="absolute bottom-3 right-3 bg-cafe-600 hover:bg-cafe-500 text-white p-2.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <ShoppingCart size={18} />
          </button>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-espresso text-lg leading-tight mb-1">
          {produto.nome}
        </h3>
        {produto.descricao && (
          <p className="text-mocha text-sm mb-3 line-clamp-2 leading-relaxed">{produto.descricao}</p>
        )}

        {produto.tempoPreparo && (
          <div className="flex items-center gap-1 text-xs text-mocha mb-3">
            <Clock size={12} />
            <span>{produto.tempoPreparo} min</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-cafe-50">
          <span className="font-display text-2xl font-bold text-cafe-600">
            R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}
          </span>
          <button
            onClick={handleAdd}
            disabled={!produto.disponivel}
            className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={15} />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}
