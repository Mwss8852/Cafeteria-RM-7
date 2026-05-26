import { Coffee } from 'lucide-react'

export default function Loading({ text = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="bg-cafe-100 p-4 rounded-full animate-bounce">
        <Coffee size={32} className="text-cafe-600" />
      </div>
      <p className="text-mocha font-medium animate-pulse">{text}</p>
    </div>
  )
}
