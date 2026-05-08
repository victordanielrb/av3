import './Modal.css'

export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box${wide ? ' modal-box--wide' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
