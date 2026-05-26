import { useState, useEffect } from 'react'
import { produtosAPI, pedidosAPI } from '../../api/services'
import StatusBadge from '../../components/ui/StatusBadge'
import Loading from '../../components/ui/Loading'
import toast from 'react-hot-toast'
import { Package, Coffee, ShoppingBag, TrendingUp, Plus, Edit2, Trash2, Check } from 'lucide-react'

const STATUS_OPTIONS = ['PENDENTE', 'EM_PREPARO', 'PRONTO', 'ENTREGUE', 'CANCELADO']
const CATEGORIAS = ['CAFE', 'BEBIDA', 'LANCHE', 'DOCE', 'SALGADO', 'ESPECIAL']

export default function AdminPage() {
  const [tab, setTab] = useState('pedidos')
  const [pedidos, setPedidos] = useState([])
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduto, setEditProduto] = useState(null)
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', categoria: 'CAFE', imagemUrl: '', disponivel: true, estoque: 0, tempoPreparo: 5 })

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [p, pr] = await Promise.all([pedidosAPI.todos(), produtosAPI.listarTodos()])
      setPedidos(p.data)
      setProdutos(pr.data)
    } catch { toast.error('Erro ao carregar dados') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const handleStatusChange = async (id, status) => {
    try {
      await pedidosAPI.atualizarStatus(id, status)
      setPedidos(pedidos.map(p => p.id === id ? { ...p, status } : p))
      toast.success('Status atualizado!')
    } catch { toast.error('Erro ao atualizar status') }
  }

  const handleSaveProduto = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, preco: parseFloat(form.preco), estoque: parseInt(form.estoque), tempoPreparo: parseInt(form.tempoPreparo) }
      if (editProduto) {
        await produtosAPI.atualizar(editProduto.id, payload)
        toast.success('Produto atualizado!')
      } else {
        await produtosAPI.criar(payload)
        toast.success('Produto criado!')
      }
      setShowForm(false); setEditProduto(null)
      setForm({ nome: '', descricao: '', preco: '', categoria: 'CAFE', imagemUrl: '', disponivel: true, estoque: 0, tempoPreparo: 5 })
      fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Erro') }
  }

  const handleEdit = (p) => {
    setEditProduto(p)
    setForm({ nome: p.nome, descricao: p.descricao || '', preco: p.preco, categoria: p.categoria, imagemUrl: p.imagemUrl || '', disponivel: p.disponivel, estoque: p.estoque, tempoPreparo: p.tempoPreparo || 5 })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Deletar produto?')) return
    try { await produtosAPI.deletar(id); toast.success('Deletado!'); fetchAll() }
    catch { toast.error('Erro ao deletar') }
  }

  const stats = [
    { label: 'Total Pedidos', value: pedidos.length, icon: ShoppingBag, color: 'bg-blue-100 text-blue-700' },
    { label: 'Pendentes', value: pedidos.filter(p => p.status === 'PENDENTE').length, icon: Package, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Produtos', value: produtos.length, icon: Coffee, color: 'bg-cafe-100 text-cafe-700' },
    { label: 'Receita', value: `R$ ${pedidos.filter(p=>p.status!=='CANCELADO').reduce((a,p)=>a+parseFloat(p.valorTotal),0).toFixed(2).replace('.',',')}`, icon: TrendingUp, color: 'bg-green-100 text-green-700' },
  ]

  if (loading) return <Loading text="Carregando painel..." />

  return (
    <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-espresso">Painel Admin</h1>
        <p className="text-mocha mt-1">Gerencie pedidos e produtos da Cafeteria RM</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}><Icon size={22} /></div>
            <div>
              <p className="text-mocha text-xs font-medium">{label}</p>
              <p className="font-display text-2xl font-bold text-espresso">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['pedidos', 'produtos'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-xl font-medium capitalize transition-all ${tab === t ? 'bg-cafe-600 text-white shadow-md' : 'bg-white text-mocha border border-cafe-200 hover:border-cafe-400'}`}>
            {t === 'pedidos' ? '📦 Pedidos' : '☕ Produtos'}
          </button>
        ))}
      </div>

      {/* Pedidos Tab */}
      {tab === 'pedidos' && (
        <div className="space-y-4">
          {pedidos.length === 0 && <p className="text-mocha text-center py-10">Nenhum pedido encontrado</p>}
          {pedidos.map(pedido => (
            <div key={pedido.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-cafe-100 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-cafe-700 font-display">#{pedido.id}</div>
                  <div>
                    <p className="font-semibold text-espresso">{pedido.nomeUsuario}</p>
                    <p className="text-sm text-mocha">{pedido.itens?.length} itens · R$ {parseFloat(pedido.valorTotal).toFixed(2).replace('.',',')} {pedido.numeroMesa && `· Mesa ${pedido.numeroMesa}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={pedido.status} />
                  <select
                    value={pedido.status}
                    onChange={e => handleStatusChange(pedido.id, e.target.value)}
                    className="text-sm border border-cafe-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cafe-400 bg-white"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              {pedido.itens?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-cafe-50 text-sm text-mocha">
                  {pedido.itens.map(i => `${i.quantidade}x ${i.nomeProduto}`).join(' · ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Produtos Tab */}
      {tab === 'produtos' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => { setShowForm(true); setEditProduto(null) }} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Novo Produto
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="card p-6 mb-6 animate-slide-up">
              <h3 className="font-display text-xl font-bold text-espresso mb-5">
                {editProduto ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <form onSubmit={handleSaveProduto} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-espresso mb-1">Nome *</label>
                  <input required value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} className="input-field" placeholder="Nome do produto" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-espresso mb-1">Preço *</label>
                  <input required type="number" step="0.01" value={form.preco} onChange={e=>setForm({...form,preco:e.target.value})} className="input-field" placeholder="0,00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-espresso mb-1">Categoria *</label>
                  <select value={form.categoria} onChange={e=>setForm({...form,categoria:e.target.value})} className="input-field">
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-espresso mb-1">Estoque</label>
                  <input type="number" value={form.estoque} onChange={e=>setForm({...form,estoque:e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-espresso mb-1">Tempo de Preparo (min)</label>
                  <input type="number" value={form.tempoPreparo} onChange={e=>setForm({...form,tempoPreparo:e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-espresso mb-1">URL da Imagem</label>
                  <input value={form.imagemUrl} onChange={e=>setForm({...form,imagemUrl:e.target.value})} className="input-field" placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-espresso mb-1">Descrição</label>
                  <textarea value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})} className="input-field" rows={2} placeholder="Descrição do produto" />
                </div>
                <div className="md:col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="disp" checked={form.disponivel} onChange={e=>setForm({...form,disponivel:e.target.checked})} className="w-4 h-4 accent-cafe-600" />
                  <label htmlFor="disp" className="text-sm font-medium text-espresso">Disponível</label>
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" className="btn-primary flex items-center gap-2"><Check size={16}/> Salvar</button>
                  <button type="button" onClick={()=>{setShowForm(false);setEditProduto(null)}} className="btn-secondary">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {/* Products list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {produtos.map(p => (
              <div key={p.id} className="card p-4 flex gap-4">
                <img src={p.imagemUrl || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&fit=crop'} alt={p.nome}
                  className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                  onError={e=>e.target.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&fit=crop'} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-espresso truncate">{p.nome}</h4>
                  <p className="text-cafe-600 font-bold">R$ {parseFloat(p.preco).toFixed(2).replace('.',',')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge text-xs ${p.disponivel ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.disponivel ? 'Disponível' : 'Indisponível'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEdit(p)} className="p-2 hover:bg-cafe-100 rounded-lg text-cafe-600 transition-colors"><Edit2 size={15} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-100 rounded-lg text-red-500 transition-colors"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
