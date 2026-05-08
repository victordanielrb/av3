import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import './Layout.css'

export default function Layout({ title, children }) {
  const navigate = useNavigate()

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <header className="layout-header">
          <h2 className="layout-title">{title}</h2>
          <button className="layout-avatar" onClick={() => navigate('/usuario')} title="Perfil">
            ⚙
          </button>
        </header>
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  )
}
