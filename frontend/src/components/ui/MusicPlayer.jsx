import { useState, useRef, useEffect } from 'react'
import { Music, VolumeX, Volume2, ChevronDown, ChevronUp } from 'lucide-react'

const MUSICAS = [
  {
    nome: 'Lofi Coffee Morning',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    emoji: '☕',
  },
  {
    nome: 'Jazz Café Vibes',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    emoji: '🎷',
  },
  {
    nome: 'Bossa Nova Tarde',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    emoji: '🎸',
  },
]

export default function MusicPlayer() {
  const [tocando, setTocando] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [mutado, setMutado] = useState(false)
  const [expandido, setExpandido] = useState(false)
  const [musicaAtual, setMusicaAtual] = useState(0)
  const [mostrarBanner, setMostrarBanner] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = mutado ? 0 : volume
    }
  }, [volume, mutado])

  useEffect(() => {
    if (audioRef.current) {
      if (tocando) {
        audioRef.current.play().catch(() => setTocando(false))
      } else {
        audioRef.current.pause()
      }
    }
  }, [tocando, musicaAtual])

  const tocar = () => {
    setTocando(true)
    setMostrarBanner(false)
  }

  const trocarMusica = (idx) => {
    setMusicaAtual(idx)
    setTocando(true)
    setMostrarBanner(false)
  }

  const musica = MUSICAS[musicaAtual]

  return (
    <>
      <audio ref={audioRef} src={musica.url} loop />

      {mostrarBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-espresso text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-cafe-700">
            <div className="text-2xl animate-bounce">☕</div>
            <div>
              <p className="font-display font-semibold text-cafe-200 text-sm">Ambiente musical da Cafeteria RM</p>
              <p className="text-cafe-400 text-xs">Ative para uma experiência completa</p>
            </div>
            <div className="flex gap-2">
              <button onClick={tocar} className="bg-cafe-500 hover:bg-cafe-400 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                🎵 Ativar
              </button>
              <button onClick={() => setMostrarBanner(false)} className="text-cafe-500 hover:text-cafe-300 text-xs px-2 transition-colors">
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-24 left-6 z-50">
        <div className={`bg-espresso border border-cafe-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${expandido ? 'w-64' : 'w-auto'}`}>
          <div className="flex items-center gap-3 px-3 py-2.5">
            <button
              onClick={() => { setTocando(!tocando); setMostrarBanner(false) }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${tocando ? 'bg-cafe-500 hover:bg-cafe-400' : 'bg-cafe-800 hover:bg-cafe-700'}`}
            >
              {tocando
                ? <span className="flex gap-0.5"><span className="w-1 h-3 bg-white rounded-full" /><span className="w-1 h-3 bg-white rounded-full" /></span>
                : <Music size={16} className="text-cafe-300 ml-0.5" />
              }
            </button>

            {tocando && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{musica.emoji} {musica.nome}</p>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="w-0.5 bg-cafe-400 rounded-full animate-bounce"
                      style={{ height: `${8 + Math.random() * 8}px`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setMutado(!mutado)} className="p-1.5 hover:bg-cafe-800 rounded-lg transition-colors flex-shrink-0">
              {mutado ? <VolumeX size={14} className="text-cafe-500" /> : <Volume2 size={14} className="text-cafe-400" />}
            </button>

            <button onClick={() => setExpandido(!expandido)} className="p-1.5 hover:bg-cafe-800 rounded-lg transition-colors flex-shrink-0">
              {expandido ? <ChevronDown size={14} className="text-cafe-400" /> : <ChevronUp size={14} className="text-cafe-400" />}
            </button>
          </div>

          {expandido && (
            <div className="border-t border-cafe-800 px-3 py-3">
              <div className="flex items-center gap-2 mb-3">
                <Volume2 size={12} className="text-cafe-500 flex-shrink-0" />
                <input type="range" min="0" max="1" step="0.05" value={mutado ? 0 : volume}
                  onChange={e => { setVolume(parseFloat(e.target.value)); setMutado(false) }}
                  className="flex-1 h-1 rounded-full accent-cafe-500 cursor-pointer" />
              </div>
              <p className="text-cafe-500 text-xs mb-2 uppercase tracking-widest">Playlist</p>
              <div className="space-y-1">
                {MUSICAS.map((m, i) => (
                  <button key={i} onClick={() => trocarMusica(i)}
                    className={`w-full text-left px-2 py-2 rounded-xl text-xs transition-all flex items-center gap-2 ${
                      i === musicaAtual && tocando ? 'bg-cafe-700 text-cafe-200' : 'text-cafe-400 hover:bg-cafe-800 hover:text-cafe-200'
                    }`}>
                    <span>{m.emoji}</span>
                    <span className="flex-1 truncate">{m.nome}</span>
                    {i === musicaAtual && tocando && <span className="text-cafe-400 text-xs">▶</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}