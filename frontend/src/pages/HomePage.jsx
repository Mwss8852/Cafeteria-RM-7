import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Coffee, Star, Clock, Shield, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'

const SLIDES = [
  {
    id: 1,
    nome: 'Café Tradicional',
    descricao: 'Café coado fresquinho, encorpado e aromático. Feito com grãos selecionados do sul de Minas.',
    preco: 'R$ 6,00',
    imagem: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1400&h=800&fit=crop&q=90',
    tag: '☕ Mais Pedido',
    cor: 'from-amber-950/80',
  },
  {
    id: 2,
    nome: 'Cappuccino Clássico',
    descricao: 'Espresso cremoso coberto com leite vaporizado e espuma sedosa. Polvilhado com chocolate em pó.',
    preco: 'R$ 12,00',
    imagem: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=1400&h=800&fit=crop&q=90',
    tag: '⭐ Favorito',
    cor: 'from-stone-950/80',
  },
  {
    id: 3,
    nome: 'Café Gourmet Especial',
    descricao: 'Blend exclusivo de grãos arábica 100%, com notas de caramelo, frutas vermelhas e chocolate amargo.',
    preco: 'R$ 16,00',
    imagem: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&h=800&fit=crop&q=90',
    tag: '✨ Premium',
    cor: 'from-cafe-950/80',
  },
  {
    id: 4,
    nome: 'Cold Brew Premium',
    descricao: 'Café extraído a frio por 24 horas. Suave, encorpado e naturalmente adocicado. Servido com gelo.',
    preco: 'R$ 15,00',
    imagem: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1400&h=800&fit=crop&q=90',
    tag: '🧊 Gelado',
    cor: 'from-slate-950/80',
  },
  {
    id: 5,
    nome: 'Espresso Intenso',
    descricao: 'Dose dupla de espresso com crema perfeita. Para quem aprecia um café forte e marcante.',
    preco: 'R$ 9,00',
    imagem: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=1400&h=800&fit=crop&q=90',
    tag: '💪 Forte',
    cor: 'from-zinc-950/80',
  },
]

const FEATURES = [
  { icon: Coffee, title: 'Café Artesanal', desc: 'Grãos selecionados das melhores fazendas do Brasil' },
  { icon: Star, title: 'Qualidade Premium', desc: 'Ingredientes frescos preparados com carinho todo dia' },
  { icon: Clock, title: 'Pedido Rápido', desc: 'Faça seu pedido online e retire na hora certa' },
  { icon: Shield, title: 'Seguro e Confiável', desc: 'Pagamento seguro e rastreamento do seu pedido' },
]

const DESTAQUES = [
  {
    nome: 'Café Tradicional',
    preco: 6.00,
    imagem: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&q=90',
    categoria: 'CAFE',
    id: 1,
  },
  {
    nome: 'Cappuccino Clássico',
    preco: 12.00,
    imagem: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop&q=90',
    categoria: 'CAFE',
    id: 2,
  },
  {
    nome: 'Café Gourmet',
    preco: 16.00,
    imagem: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&q=90',
    categoria: 'ESPECIAL',
    id: 3,
  },
  {
    nome: 'Cheesecake',
    preco: 18.00,
    imagem: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop&q=90',
    categoria: 'DOCE',
    id: 10,
  },
]

export default function HomePage() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const goTo = useCallback((idx) => {
    if (animating) return
    setAnimating(true)
    setCurrent(idx)
    setTimeout(() => setAnimating(false), 600)
  }, [animating])

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length)
  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo])

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const slide = SLIDES[current]

  return (
    <div className="min-h-screen">

      {/* ═══ CARROSSEL ═══ */}
      <section className="relative w-full h-[90vh] overflow-hidden">
        {/* Imagens com transição */}
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            <img
              src={s.imagem}
              alt={s.nome}
              className="w-full h-full object-cover"
            />
            {/* Gradiente escuro */}
            <div className={`absolute inset-0 bg-gradient-to-r ${s.cor} via-black/40 to-transparent`} />
          </div>
        ))}

        {/* Conteúdo do slide */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
            <div className="max-w-xl" key={current}>
              <span className="inline-block bg-cafe-500/90 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5 animate-slide-up">
                {slide.tag}
              </span>
              <h1
                className="font-display text-5xl md:text-7xl font-bold text-white mb-4 leading-tight animate-slide-up"
                style={{ animationDelay: '0.1s' }}
              >
                {slide.nome}
              </h1>
              <p
                className="text-white/80 text-lg md:text-xl mb-6 leading-relaxed animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                {slide.descricao}
              </p>
              <div className="flex items-center gap-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <span className="font-display text-4xl font-bold text-cafe-300">{slide.preco}</span>
                <Link
                  to="/cardapio"
                  className="bg-cafe-500 hover:bg-cafe-400 text-white font-semibold px-7 py-3.5 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <ShoppingCart size={18} /> Pedir agora
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'bg-cafe-400 w-8 h-2.5'
                  : 'bg-white/40 hover:bg-white/70 w-2.5 h-2.5'
              }`}
            />
          ))}
        </div>

        {/* Thumbs laterais */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                i === current ? 'border-cafe-400 scale-110 shadow-lg' : 'border-white/20 opacity-50 hover:opacity-80'
              }`}
            >
              <img src={s.imagem} alt={s.nome} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* ═══ DESTAQUES ═══ */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-cafe-500 font-semibold text-sm uppercase tracking-widest mb-2">Seleção especial</p>
            <h2 className="font-display text-4xl font-bold text-espresso">
              Mais <span className="text-cafe-600">Pedidos</span>
            </h2>
          </div>
          <Link to="/cardapio" className="text-cafe-600 hover:text-cafe-700 font-semibold text-sm flex items-center gap-1 transition-colors">
            Ver tudo →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {DESTAQUES.map((item) => (
            <div key={item.id} className="group card overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button
                  onClick={() => { addItem({ ...item, preco: item.preco }); toast.success(`${item.nome} adicionado! ☕`, { duration: 1500 }) }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-cafe-500 hover:bg-cafe-400 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap"
                >
                  <ShoppingCart size={13} /> Adicionar
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-espresso">{item.nome}</h3>
                <p className="text-cafe-600 font-bold mt-1">R$ {item.preco.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-16 px-4 bg-cafe-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-cafe-400 font-semibold text-sm uppercase tracking-widest mb-2">Nossa proposta</p>
            <h2 className="font-display text-4xl font-bold text-white">
              Por que escolher a <span className="text-cafe-400">RM</span>?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-cafe-800 group-hover:bg-cafe-500 rounded-2xl mb-4 transition-colors duration-300">
                  <Icon className="text-cafe-300 group-hover:text-white transition-colors duration-300" size={26} />
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-cafe-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="relative py-24 px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1400&h=500&fit=crop&q=90"
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-espresso/80" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-display text-5xl font-bold text-white mb-4">
            Pronto para o melhor café da cidade?
          </h2>
          <p className="text-cafe-200 text-lg mb-8">
            Explore o cardápio completo e faça seu pedido em segundos.
          </p>
          <Link
            to="/cardapio"
            className="inline-block bg-cafe-500 hover:bg-cafe-400 text-white font-bold px-10 py-4 rounded-2xl text-lg transition-all duration-200 shadow-xl hover:-translate-y-0.5"
          >
            Ver Cardápio Completo ☕
          </Link>
        </div>
      </section>

    </div>
  )
}
