import { NavLink, useNavigate } from 'react-router-dom'
import './Sidebar.css'

const navItems = [
  { to: '/aeronaves', label: 'Aeronaves', icon: '✈' },
  { to: '/etapas',    label: 'Etapas',    icon: '⚙' },
  { to: '/pecas',     label: 'Peças',     icon: '🔧' },
  { to: '/testes',    label: 'Testes',    icon: '✓' },
  { to: '/funcionarios', label: 'Funcionários', icon: '👤' },
  { to: '/relatorios', label: 'Relatórios', icon: '📊' },
]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">AV2</div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' sidebar-link--active' : '')
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
