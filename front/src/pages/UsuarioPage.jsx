import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { funcionariosApi } from '../services/api'
import './Page.css'
import './UsuarioPage.css'

const NIVEL_LABEL = {
  ADMINISTRADOR: 'Administrador',
  ENGENHEIRO: 'Engenheiro',
  OPERADOR: 'Operador',
}

export default function UsuarioPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    funcionariosApi.me()
      .then(setDados)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  const nivel = dados?.nivelPermissao || user?.nivelPermissao

  return (
    <Layout title="Configurações">
      <div className="usuario-card">
        <div className="usuario-avatar">
          {(dados?.nome || user?.usuario || '?')[0].toUpperCase()}
        </div>

        <h2 className="usuario-nome">{dados?.nome || user?.usuario}</h2>
        <span className={`usuario-nivel-badge usuario-nivel--${nivel?.toLowerCase()}`}>
          {NIVEL_LABEL[nivel] || nivel}
        </span>

        {loading ? (
          <p className="page-loading" style={{ marginTop: '24px' }}>Carregando...</p>
        ) : dados && (
          <dl className="usuario-dl">
            <dt>Login</dt>
            <dd>{dados.usuario}</dd>

            <dt>Telefone</dt>
            <dd>{dados.telefone || <span className="usuario-vazio">Não informado</span>}</dd>

            <dt>Endereço</dt>
            <dd>{dados.endereco || <span className="usuario-vazio">Não informado</span>}</dd>

            <dt>Nível de acesso</dt>
            <dd>{NIVEL_LABEL[dados.nivelPermissao] || dados.nivelPermissao}</dd>
          </dl>
        )}

        <div className="usuario-relatorios">
          <div className="usuario-relatorios-header">
            <h3>Relatórios</h3>
            <Link to="/relatorios" className="btn-ver-relatorios">Ver todos</Link>
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
          <button className="btn-cancel" onClick={handleLogout}>Sair</button>
        </div>
      </div>
    </Layout>
  )
}
