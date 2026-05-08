import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ItemRow from '../components/ItemRow'
import Modal from '../components/Modal'
import { aeronavesApi, testesApi } from '../services/api'
import './Page.css'

const FORM_INITIAL = { tipo: 'ELETRICO', aeronaveCodigo: '', resultado: 'APROVADO' }

export default function TestesPage() {
  const [items, setItems] = useState([])
  const [aeronaves, setAeronaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [form, setForm] = useState(FORM_INITIAL)
  const [saving, setSaving] = useState(false)

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const avs = await aeronavesApi.list()
      setAeronaves(avs)
      const results = await Promise.all(avs.map(a => testesApi.listByAeronave(a.codigo)))
      setItems(results.flat().map(t => ({
        ...t,
        _aeronaveName: avs.find(a => a.codigo === t.aeronaveCodigo)?.modelo || t.aeronaveCodigo,
      })))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setForm({ ...FORM_INITIAL, aeronaveCodigo: aeronaves[0]?.codigo || '' })
    setModal('add')
  }

  async function handleDelete(id) {
    try {
      await testesApi.delete(id)
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const { aeronaveCodigo, ...body } = form
      await testesApi.create(aeronaveCodigo, body)
      setModal(null)
      await load()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Layout title="Testes"><p className="page-loading">Carregando...</p></Layout>
  if (error) return <Layout title="Testes"><p className="page-error">{error}</p></Layout>

  return (
    <Layout title="Testes">
      <div className="page-toolbar">
        <button className="btn-add" onClick={openAdd}>Adicionar</button>
      </div>

      <div className="list">
        {items.map(item => (
          <ItemRow
            key={item.id}
            title={`${item.tipo} — ${item._aeronaveName}`}
            subtitle={item.resultado}
            onClick={() => setViewItem(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>

      {viewItem && (
        <Modal title="Detalhes do Teste" onClose={() => setViewItem(null)}>
          <div className="modal-field">
            <label>Aeronave</label>
            <input value={viewItem._aeronaveName} readOnly />
          </div>
          <div className="modal-field">
            <label>Tipo</label>
            <input value={viewItem.tipo} readOnly />
          </div>
          <div className="modal-field">
            <label>Resultado</label>
            <input value={viewItem.resultado} readOnly />
          </div>
        </Modal>
      )}

      {modal === 'add' && (
        <Modal title="Realizar Teste" onClose={() => setModal(null)}>
          <div className="modal-field">
            <label>Aeronave</label>
            <select value={form.aeronaveCodigo} onChange={e => setForm(f => ({ ...f, aeronaveCodigo: e.target.value }))}>
              {aeronaves.map(a => <option key={a.codigo} value={a.codigo}>{a.modelo} ({a.codigo})</option>)}
            </select>
          </div>
          <div className="modal-field">
            <label>Tipo</label>
            <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
              <option value="ELETRICO">ELÉTRICO</option>
              <option value="HIDRAULICO">HIDRÁULICO</option>
              <option value="AERODINAMICO">AERODINÂMICO</option>
            </select>
          </div>
          <div className="modal-field">
            <label>Resultado</label>
            <select value={form.resultado} onChange={e => setForm(f => ({ ...f, resultado: e.target.value }))}>
              <option value="APROVADO">APROVADO</option>
              <option value="REPROVADO">REPROVADO</option>
            </select>
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
