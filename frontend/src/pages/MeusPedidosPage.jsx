import { useState, useEffect } from 'react'
import { pedidosAPI } from '../api/services'
import StatusBadge from '../components/ui/StatusBadge'
import Loading from '../components/ui/Loading'
import { Package, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  const fetchPedidos = () => {
    pedidosAPI.meus()
      .then(({ data }) => setPedidos(data))
      .catch(() => toast.error('Erro ao carregar pedidos'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPedidos() }, [])

  const handleCancelar = async (id) => {
    if (!confirm('Cancelar este pedido?')) return
    try {
      await pedidosAPI.cancelar(id)
      toast.success('Pedido cancelado')
      fetchPedidos()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Não foi possível cancelar')
    }
  }

  if (loading) return <Loading text="Carregando pedidos..." />

  return (
    <div className="min-h-screen py-10 px-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-espresso">Meus Pedidos</h1>
        <p className="text-mocha mt-1">Acompanhe seus pedidos em tempo real</p>
      </div>

      {pedidos.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-cafe-100 rounded-full mb-4">
            <Package size={36} className="text-cafe-400" />
          </div>
          <h3 className="font-display text-2xl font-bold text-espresso mb-2">Nenhum pedido ainda</h3>
          <p className="text-mocha">Explore o cardápio e faça seu primeiro pedido!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="card overflow-hidden animate-fade-in">
              <div
                className="p-5 cursor-pointer flex flex-wrap items-center justify-between gap-4"
                onClick={() => setExpanded(expanded === pedido.id ? null : pedido.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-cafe-100 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-cafe-700 font-display">
                    #{pedido.id}
                  </div>
                  <div>
                    <p className="font-semibold text-espresso">
                      {pedido.itens?.length || 0} {pedido.itens?.length === 1 ? 'item' : 'itens'}
                      {pedido.numeroMesa && <span className="text-mocha font-normal"> · Mesa {pedido.numeroMesa}</span>}
                    </p>
                    <p className="text-sm text-mocha">
                      {new Date(pedido.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-xl font-bold text-cafe-600">
                    R$ {parseFloat(pedido.valorTotal).toFixed(2).replace('.', ',')}
                  </span>
                  <StatusBadge status={pedido.status} />
                  {['PENDENTE', 'EM_PREPARO'].includes(pedido.status) && (
                    <button
                      onClick={e => { e.stopPropagation(); handleCancelar(pedido.id) }}
                      className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                      title="Cancelar"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {expanded === pedido.id && (
                <div className="border-t border-cafe-100 p-5 bg-cafe-50 animate-fade-in">
                  <h4 className="font-semibold text-espresso mb-3">Itens do pedido:</h4>
                  <div className="space-y-2">
                    {pedido.itens?.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-espresso">
                          <span className="font-medium">{item.quantidade}x</span> {item.nomeProduto}
                        </span>
                        <span className="text-cafe-600 font-semibold">
                          R$ {parseFloat(item.subtotal).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                  </div>
                  {pedido.observacao && (
                    <p className="mt-3 text-sm text-mocha italic">📝 {pedido.observacao}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
