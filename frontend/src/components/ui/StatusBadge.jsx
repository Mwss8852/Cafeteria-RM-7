const STATUS_CONFIG = {
  PENDENTE:    { label: 'Pendente',    cls: 'bg-yellow-100 text-yellow-800' },
  EM_PREPARO:  { label: 'Em Preparo',  cls: 'bg-blue-100 text-blue-800' },
  PRONTO:      { label: 'Pronto',      cls: 'bg-green-100 text-green-800' },
  ENTREGUE:    { label: 'Entregue',    cls: 'bg-gray-100 text-gray-700' },
  CANCELADO:   { label: 'Cancelado',   cls: 'bg-red-100 text-red-800' },
}

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, cls: 'bg-gray-100 text-gray-700' }
  return (
    <span className={`badge font-semibold ${cfg.cls}`}>{cfg.label}</span>
  )
}
