import './ItemRow.css'

export default function ItemRow({ title, subtitle, onEdit, onDelete, onClick, extraActions }) {
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
      className={`item-row${isClickable ? ' item-row-clickable' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div className="item-row-info">
        <span className="item-row-title">{title}</span>
        <span className="item-row-subtitle">{subtitle}</span>
      </div>
      <div className="item-row-actions">
        {extraActions}
        {onEdit && (
          <button className="btn-edit" onClick={e => { e.stopPropagation(); onEdit() }}>Editar</button>
        )}
        {onDelete && (
          <button className="btn-delete" onClick={e => { e.stopPropagation(); onDelete() }}>Excluir</button>
        )}
      </div>
    </div>
  )
}
