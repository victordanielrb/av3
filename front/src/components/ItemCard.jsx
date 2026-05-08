import './ItemCard.css'

export default function ItemCard({ title, subtitle, onEdit, onDelete, onClick, extraActions }) {
  const isClickable = Boolean(onClick)

  function handleKeyDown(event) {
    if (!isClickable) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className={`item-card${isClickable ? ' item-card-clickable' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className="item-card-info">
        <span className="item-card-title">{title}</span>
        <span className="item-card-subtitle">{subtitle}</span>
      </div>
      <div className="item-card-actions">
        {extraActions}
        {onEdit && <button className="btn-edit" onClick={e => { e.stopPropagation(); onEdit() }}>Editar</button>}
        {onDelete && <button className="btn-delete" onClick={e => { e.stopPropagation(); onDelete() }}>Excluir</button>}
      </div>
    </div>
  )
}
