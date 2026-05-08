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

  const handleBrandClick = () => {
    window.open('https://s2-ge.glbimg.com/j8Gu4BMepUzt2hY0UhlINei-8tQ=/0x0:1112x776/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2022/Z/0/5818m2Ss68kgH7U4gZ4A/1834127218.jpg', '_blank')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand" onClick={handleBrandClick} style={{ cursor: 'pointer' }}>AV2</div>
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
