import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ItemCard from '../components/ItemCard'
import Modal from '../components/Modal'
import { aeronavesApi, etapasApi, funcionariosApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { maskDate } from '../utils/masks'
import './Page.css'

const STATUS_LABEL = { PENDENTE: 'Pendente', ANDAMENTO: 'Em Andamento', CONCLUIDA: 'Concluída' }
const FORM_INITIAL = { nome: '', aeronaveCodigo: '', prazo: '' }

export default function EtapasPage() {
  const { user } = useAuth()
  const canManage = user?.nivelPermissao === 'ADMINISTRADOR' || user?.nivelPermissao === 'ENGENHEIRO'

  const [items, setItems] = useState([])
  const [aeronaves, setAeronaves] = useState([])
  const [allFuncionarios, setAllFuncionarios] = useState([])
  const [funcsError, setFuncsError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [viewFuncionarios, setViewFuncionarios] = useState([])
  const [loadingFuncs, setLoadingFuncs] = useState(false)
  const [selectedFuncId, setSelectedFuncId] = useState('')
  const [form, setForm] = useState(FORM_INITIAL)
  const [saving, setSaving] = useState(false)

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const avs = await aeronavesApi.list()
      setAeronaves(avs)
      const results = await Promise.all(avs.map(a => etapasApi.listByAeronave(a.codigo)))
      setItems(results.flat()
        .filter(e => e.status !== 'CONCLUIDA')
        .map(e => ({
          ...e,
          _aeronaveName: avs.find(a => a.codigo === e.aeronaveCodigo)?.modelo || e.aeronaveCodigo,
        })))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (canManage) {
      setFuncsError(null)
      funcionariosApi.list().then(setAllFuncionarios).catch(err => setFuncsError(err.message))
    }
  }, [canManage])

  async function openView(item) {
    setViewItem(item)
    setSelectedFuncId('')
    setLoadingFuncs(true)
    try {
      const funcs = await etapasApi.listFuncionarios(item.id)
      setViewFuncionarios(funcs)
    } catch {
      setViewFuncionarios([])
    } finally {
      setLoadingFuncs(false)
    }
  }

  function closeView() {
    setViewItem(null)
    setViewFuncionarios([])
    setSelectedFuncId('')
  }

  async function handleAddFuncionario() {
    if (!selectedFuncId) return
    try {
      await etapasApi.addFuncionario(viewItem.id, Number(selectedFuncId))
      const funcs = await etapasApi.listFuncionarios(viewItem.id)
      setViewFuncionarios(funcs)
      setSelectedFuncId('')
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleRemoveFuncionario(fid) {
    try {
      await etapasApi.removeFuncionario(viewItem.id, fid)
      setViewFuncionarios(prev => prev.filter(f => f.funcionarioId !== fid))
    } catch (err) {
      alert(err.message)
    }
  }

  function openAdd() {
    setForm({ ...FORM_INITIAL, aeronaveCodigo: aeronaves[0]?.codigo || '' })
    setModal('add')
  }

  async function handleDelete(id) {
    try {
      await etapasApi.delete(id)
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleIniciar(id) {
    try {
      await etapasApi.iniciar(id)
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleFinalizar(id) {
    try {
      await etapasApi.finalizar(id)
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const { aeronaveCodigo, ...body } = form
      await etapasApi.create(aeronaveCodigo, body)
      setModal(null)
      await load()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const groupedByAeronave = Object.entries(
    items.reduce((acc, item) => {
      const key = item._aeronaveName
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {})
  ).sort(([a], [b]) => a.localeCompare(b))

  function getStatusCount(groupItems, status) {
    return groupItems.filter(item => item.status === status).length
  }

  const assignedIds = new Set(viewFuncionarios.map(f => f.funcionarioId))
  const availableFuncs = allFuncionarios.filter(f => !assignedIds.has(f.id))

  if (loading) return <Layout title="Etapas"><p className="page-loading">Carregando...</p></Layout>
  if (error) return <Layout title="Etapas"><p className="page-error">{error}</p></Layout>

  return (
    <Layout title="Etapas">
      <div className="page-toolbar">
        <button className="btn-add" onClick={openAdd}>Adicionar</button>
      </div>

      <div className="etapas-groups">
        {groupedByAeronave.map(([aeronave, groupItems]) => (
          <section key={aeronave} className="etapas-group">
            <header className="etapas-group-header">
              <div>
                <h3 className="etapas-group-title">{aeronave}</h3>
                <p className="etapas-group-subtitle">{groupItems.length} etapa(s)</p>
              </div>
              <div className="etapas-statuses">
                <span className="status-chip">Pendente: {getStatusCount(groupItems, 'PENDENTE')}</span>
                <span className="status-chip">Andamento: {getStatusCount(groupItems, 'ANDAMENTO')}</span>
                <span className="status-chip">Concluída: {getStatusCount(groupItems, 'CONCLUIDA')}</span>
              </div>
            </header>

            <div className="grid-3">
              {groupItems.map(item => (
                <ItemCard
                  key={item.id}
                  title={item.nome}
                  subtitle={`${STATUS_LABEL[item.status]} · Prazo: ${item.prazo}`}
                  onClick={() => openView(item)}
                  onDelete={() => handleDelete(item.id)}
                  extraActions={
                    <>
                      {item.status === 'PENDENTE' && (
                        <button className="btn-action" onClick={e => { e.stopPropagation(); handleIniciar(item.id) }}>Iniciar</button>
                      )}
                      {item.status === 'ANDAMENTO' && (
                        <button className="btn-action" onClick={e => { e.stopPropagation(); handleFinalizar(item.id) }}>Finalizar</button>
                      )}
                    </>
                  }
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {viewItem && (
        <Modal title="Detalhes da Etapa" onClose={closeView}>
          <div className="modal-field">
            <label>Nome</label>
            <input value={viewItem.nome} readOnly />
          </div>
          <div className="modal-field">
            <label>Aeronave</label>
            <input value={viewItem._aeronaveName} readOnly />
          </div>
          <div className="modal-field">
            <label>Status</label>
            <input value={STATUS_LABEL[viewItem.status]} readOnly />
          </div>
          <div className="modal-field">
            <label>Prazo</label>
            <input value={viewItem.prazo} readOnly />
          </div>

          <div className="modal-section">
            <label className="modal-section-label">Funcionários ({viewFuncionarios.length})</label>
            {loadingFuncs ? (
              <p className="modal-hint">Carregando...</p>
            ) : viewFuncionarios.length === 0 ? (
              <p className="modal-hint">Nenhum funcionário vinculado.</p>
            ) : (
              <ul className="func-list">
                {viewFuncionarios.map(f => (
                  <li key={f.funcionarioId} className="func-list-item">
                    <span className="func-list-name">{f.nome}</span>
                    <span className="func-list-role">{f.nivelPermissao}</span>
                    {canManage && (
                      <button className="btn-remove-func" onClick={() => handleRemoveFuncionario(f.funcionarioId)}>Remover</button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {canManage && (
              <div className="func-add-row">
                {funcsError ? (
                  <p className="page-error" style={{ margin: 0 }}>Erro ao carregar funcionários: {funcsError}</p>
                ) : availableFuncs.length === 0 ? (
                  <p className="modal-hint" style={{ margin: 0 }}>
                    {allFuncionarios.length === 0 ? 'Nenhum funcionário cadastrado.' : 'Todos os funcionários já estão vinculados.'}
                  </p>
                ) : (
                  <>
                    <select value={selectedFuncId} onChange={e => setSelectedFuncId(e.target.value)}>
                      <option value="">Selecionar funcionário...</option>
                      {availableFuncs.map(f => (
                        <option key={f.id} value={f.id}>{f.nome} ({f.nivelPermissao})</option>
                      ))}
                    </select>
                    <button className="btn-action" onClick={handleAddFuncionario} disabled={!selectedFuncId}>Vincular</button>
                  </>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {modal === 'add' && (
        <Modal title="Adicionar Etapa" onClose={() => setModal(null)}>
          <div className="modal-field">
            <label>Nome</label>
            <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Revisão Estrutural" />
          </div>
          <div className="modal-field">
            <label>Aeronave</label>
            <select value={form.aeronaveCodigo} onChange={e => setForm(f => ({ ...f, aeronaveCodigo: e.target.value }))}>
              {aeronaves.map(a => <option key={a.codigo} value={a.codigo}>{a.modelo} ({a.codigo})</option>)}
            </select>
          </div>
          <div className="modal-field">
            <label>Prazo</label>
            <input value={form.prazo} onChange={e => setForm(f => ({ ...f, prazo: maskDate(e.target.value) }))} placeholder="dd/mm/aaaa" inputMode="numeric" />
          </div>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </Modal>
      )}
    </Layout>
  )
}
