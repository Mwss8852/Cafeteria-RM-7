import { useState, useEffect } from 'react'
import { produtosAPI } from '../api/services'
import ProdutoCard from '../components/ui/ProdutoCard'
import Loading from '../components/ui/Loading'
import { Search } from 'lucide-react'

const CATEGORIAS = ['TODAS', 'CAFE', 'BEBIDA', 'LANCHE', 'DOCE', 'SALGADO', 'ESPECIAL']
const CAT_LABELS = {
  TODAS: '🍽️ Todas', CAFE: '☕ Café', BEBIDA: '🥤 Bebida',
  LANCHE: '🥪 Lanche', DOCE: '🍰 Doce', SALGADO: '🥐 Salgado', ESPECIAL: '⭐ Especial',
}

export default function CardapioPage() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoria, setCategoria] = useState('TODAS')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    produtosAPI.listar()
      .then(({ data }) => setProdutos(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtrados = produtos.filter(p => {
    const matchCat = categoria === 'TODAS' || p.categoria === categoria
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase())
    return matchCat && matchBusca
  })

  if (loading) return <Loading text="Carregando cardápio..." />

  return (
    <div className="min-h-screen py-10 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 animate-slide-up">
        <h1 className="font-display text-5xl font-bold text-espresso mb-3">
          Nosso <span className="text-cafe-600">Cardápio</span>
        </h1>
        <p className="text-mocha text-lg">Escolha com calma, cada item foi feito com amor ☕</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha" />
        <input
          type="text"
          placeholder="Buscar no cardápio..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="input-field pl-11"
        />
      </div>

      {/* Categorias */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              categoria === cat
                ? 'bg-cafe-600 text-white shadow-md'
                : 'bg-white text-mocha border border-cafe-200 hover:border-cafe-400'
            }`}
          >
            {CAT_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtrados.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-mocha text-xl">Nenhum produto encontrado 😔</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtrados.map(produto => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </div>
  )
}
