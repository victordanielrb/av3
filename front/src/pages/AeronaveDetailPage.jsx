import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import ItemCard from '../components/ItemCard'
import ItemRow from '../components/ItemRow'
import { aeronavesApi, pecasApi, etapasApi, testesApi, relatoriosApi } from '../services/api'
import Modal from '../components/Modal'
import RelatorioCard from '../components/RelatorioCard'
import { fmtNumber } from '../utils/masks'
import './Page.css'
import './AeronaveDetailPage.css'

const STATUS_LABEL = { PENDENTE: 'Pendente', ANDAMENTO: 'Em Andamento', CONCLUIDA: 'Concluída' }
const TABS = ['Peças', 'Etapas', 'Testes', 'Relatório']

// ─── Aba Peças ────────────────────────────────────────────────────────────────

function PecasTab({ codigo }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    pecasApi.listByAeronave(codigo)
      .then(setItems)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [codigo])

  if (loading) return <p className="page-loading">Carregando...</p>
  if (error)   return <p className="page-error">{error}</p>
  if (items.length === 0) return <p className="page-hint">Nenhuma peça registrada.</p>

  return (
    <div className="grid-3">
      {items.map(item => (
        <ItemCard
          key={item.id}
          title={item.nome}
          subtitle={`${item.tipo} · ${item.status}`}
        />
      ))}
    </div>
  )
}

// ─── Aba Etapas ───────────────────────────────────────────────────────────────

function EtapasTab({ codigo }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    etapasApi.listByAeronave(codigo)
      .then(setItems)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [codigo])

  if (loading) return <p className="page-loading">Carregando...</p>
  if (error)   return <p className="page-error">{error}</p>
  if (items.length === 0) return <p className="page-hint">Nenhuma etapa registrada.</p>

  return (
    <div className="grid-3">
      {items.map(item => (
        <ItemCard
          key={item.id}
          title={item.nome}
          subtitle={`${STATUS_LABEL[item.status]} · Prazo: ${item.prazo}`}
        />
      ))}
    </div>
  )
}

// ─── Aba Testes ───────────────────────────────────────────────────────────────

function TestesTab({ codigo }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    testesApi.listByAeronave(codigo)
      .then(setItems)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [codigo])

  if (loading) return <p className="page-loading">Carregando...</p>
  if (error)   return <p className="page-error">{error}</p>
  if (items.length === 0) return <p className="page-hint">Nenhum teste registrado.</p>

  return (
    <div className="list">
      {items.map(item => (
        <ItemRow
          key={item.id}
          title={item.tipo}
          subtitle={item.resultado}
        />
      ))}
    </div>
  )
}

// ─── Aba Relatório ────────────────────────────────────────────────────────────

function RelatorioTab({ codigo }) {
  const [salvos, setSalvos] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewDados, setViewDados] = useState(null)

  useEffect(() => {
    relatoriosApi.listar()
      .then(all => setSalvos(all.filter(r => r.aeronaveCodigo === codigo)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [codigo])

  if (loading) return <p className="page-loading">Carregando...</p>

  if (salvos.length === 0)
    return <p className="page-hint">Nenhum relatório salvo para esta aeronave. Gere um na página de Relatórios.</p>

  return (
    <>
      <div className="list">
        {salvos.map(r => (
          <ItemRow
            key={r.id}
            title={r.cliente}
            subtitle={`Entrega: ${r.dataEntrega} · ${new Date(r.geradoEm).toLocaleString('pt-BR')}`}
            onClick={() => setViewDados(r.dados)}
          />
        ))}
      </div>

      {viewDados && (
        <Modal title={`Relatório — ${viewDados.aeronave?.modelo || ''}`} onClose={() => setViewDados(null)} wide>
          <RelatorioCard data={viewDados} />
          <div className="modal-actions">
            <button className="btn-save" onClick={() => setViewDados(null)}>Fechar</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function AeronaveDetailPage() {
  const { codigo } = useParams()
  const navigate = useNavigate()
  const [aeronave, setAeronave] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Peças')

  useEffect(() => {
    aeronavesApi.get(codigo)
      .then(data => setAeronave(data.aeronave))
      .catch(() => navigate('/aeronaves'))
      .finally(() => setLoading(false))
  }, [codigo])

  if (loading || !aeronave) return <Layout title="Aeronave"><p className="page-loading">Carregando...</p></Layout>

  return (
    <Layout title="Aeronaves">
      <div className="detail-header">
        <button className="detail-back" onClick={() => navigate('/aeronaves')}>← Voltar</button>
        <div>
          <h2 className="detail-title">{aeronave.codigo} — {aeronave.modelo}</h2>
          <p className="detail-subtitle">{aeronave.tipo} · {fmtNumber(aeronave.capacidade)} pax · {fmtNumber(aeronave.alcance)} km</p>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab-btn${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Peças'     && <PecasTab    codigo={codigo} />}
      {activeTab === 'Etapas'    && <EtapasTab   codigo={codigo} />}
      {activeTab === 'Testes'    && <TestesTab   codigo={codigo} />}
      {activeTab === 'Relatório' && <RelatorioTab codigo={codigo} />}
    </Layout>
  )
}
