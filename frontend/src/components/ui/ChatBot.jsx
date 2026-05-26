import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Trash2, Coffee, Bot } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const AGENT_URL = 'http://localhost:5000'

const SESSION_ID = 'session_' + Math.random().toString(36).substr(2, 9)

const MENSAGENS_INICIAIS = [
  "Olá! 😊 Como posso te ajudar hoje?",
  "Posso sugerir um café, tirar dúvidas sobre seu pedido ou apresentar nosso cardápio!",
]

export default function ChatBot() {
  const { user } = useAuth()
  const [aberto, setAberto] = useState(false)
  const [mensagens, setMensagens] = useState([
    {
      role: 'assistant',
      text: `Olá${user ? ', ' + user.nome.split(' ')[0] : ''}! ☕ Sou o Café Bot, seu assistente da Cafeteria RM!\n\nPosso te ajudar com:\n• Sugestões do cardápio\n• Dúvidas sobre seus pedidos\n• Combinações perfeitas de café\n\nO que posso fazer por você hoje?`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [digitando, setDigitando] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, digitando])

  useEffect(() => {
    if (aberto) inputRef.current?.focus()
  }, [aberto])

  const enviar = async () => {
    const texto = input.trim()
    if (!texto || loading) return

    setMensagens(prev => [...prev, { role: 'user', text: texto }])
    setInput('')
    setLoading(true)
    setDigitando(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${AGENT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensagem: texto,
          sessionId: SESSION_ID,
          token: token || null,
          nomeUsuario: user?.nome || null,
        }),
      })

      const data = await res.json()
      setDigitando(false)

      if (data.resposta) {
        setMensagens(prev => [...prev, { role: 'assistant', text: data.resposta }])
      } else {
        setMensagens(prev => [...prev, { role: 'assistant', text: 'Desculpe, tive um problema. Tente novamente! 😅' }])
      }
    } catch {
      setDigitando(false)
      setMensagens(prev => [...prev, {
        role: 'assistant',
        text: '⚠️ Agente temporariamente indisponível. Verifique se o servidor Python está rodando na porta 5000.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const limpar = async () => {
    try {
      await fetch(`${AGENT_URL}/limpar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: SESSION_ID }),
      })
    } catch {}
    setMensagens([{
      role: 'assistant',
      text: `Conversa reiniciada! ☕ Como posso te ajudar${user ? ', ' + user.nome.split(' ')[0] : ''}?`,
    }])
  }

  const sugestoes = [
    'Qual café você recomenda?',
    'Ver meus pedidos',
    'Quais doces têm?',
    'Combina com o quê?',
  ]

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setAberto(!aberto)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-cafe-600 hover:bg-cafe-500 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="Falar com Café Bot"
      >
        {aberto
          ? <X size={22} />
          : (
            <div className="relative">
              <MessageCircle size={24} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-cafe-600 animate-pulse" />
            </div>
          )
        }
      </button>

      {/* Janela do chat */}
      {aberto && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-cafe-200 animate-slide-up"
          style={{ height: '520px', background: '#fff' }}>

          {/* Header */}
          <div className="bg-espresso px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 bg-cafe-500 rounded-full flex items-center justify-center">
                <Coffee size={18} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-espresso" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Café Bot RM</p>
              <p className="text-cafe-400 text-xs">Online agora ✨</p>
            </div>
            <button onClick={limpar} className="p-1.5 hover:bg-cafe-800 rounded-lg transition-colors" title="Limpar conversa">
              <Trash2 size={15} className="text-cafe-400" />
            </button>
            <button onClick={() => setAberto(false)} className="p-1.5 hover:bg-cafe-800 rounded-lg transition-colors">
              <X size={15} className="text-cafe-400" />
            </button>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ background: '#fdf8f0' }}>
            {mensagens.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-cafe-600 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-cafe-600 text-white rounded-br-sm'
                      : 'bg-white text-espresso rounded-bl-sm shadow-sm border border-cafe-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Digitando */}
            {digitando && (
              <div className="flex justify-start">
                <div className="w-7 h-7 bg-cafe-600 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-white border border-cafe-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-cafe-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-cafe-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-cafe-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugestões rápidas */}
          {mensagens.length <= 2 && (
            <div className="px-3 py-2 flex gap-2 overflow-x-auto flex-shrink-0" style={{ background: '#fdf8f0' }}>
              {sugestoes.map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); inputRef.current?.focus() }}
                  className="text-xs whitespace-nowrap bg-white border border-cafe-200 text-cafe-700 px-3 py-1.5 rounded-full hover:bg-cafe-50 hover:border-cafe-400 transition-colors flex-shrink-0"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-cafe-100 flex gap-2 flex-shrink-0 bg-white">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviar()}
              placeholder="Digite sua mensagem..."
              disabled={loading}
              className="flex-1 text-sm border border-cafe-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cafe-400 focus:border-transparent bg-cafe-50 text-espresso disabled:opacity-60"
            />
            <button
              onClick={enviar}
              disabled={loading || !input.trim()}
              className="w-9 h-9 bg-cafe-600 hover:bg-cafe-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
