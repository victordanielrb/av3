import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ItemCard from '../components/ItemCard'
import Modal from '../components/Modal'
import { aeronavesApi, pecasApi } from '../services/api'
import './Page.css'

const FORM_INITIAL = { nome: '', aeronaveCodigo: '', tipo: 'NACIONAL', fornecedor: '', status: 'EM_PRODUCAO' }

export default function PecasPage() {
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
      const results = await Promise.all(avs.map(a => pecasApi.listByAeronave(a.codigo)))
      setItems(results.flat().map((p, _, arr) => ({
        ...p,
        _aeronaveName: avs.find(a => a.codigo === p.aeronaveCodigo)?.modelo || p.aeronaveCodigo,
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

  function openEdit(item) {
    setForm({ status: item.status, aeronaveCodigo: item.aeronaveCodigo, nome: item.nome, tipo: item.tipo, fornecedor: item.fornecedor })
    setModal(item)
  }

  async function handleDelete(id) {
    try {
      await pecasApi.delete(id)
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (modal === 'add') {
        const { aeronaveCodigo, ...body } = form
        await pecasApi.create(aeronaveCodigo, body)
      } else {
        await pecasApi.updateStatus(modal.id, form.status)
      }
      setModal(null)
      await load()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Layout title="Peças"><p className="page-loading">Carregando...</p></Layout>
  if (error) return <Layout title="Peças"><p className="page-error">{error}</p></Layout>

  return (
    <Layout title="Peças">
      <div className="page-toolbar">
        <button className="btn-add" onClick={openAdd}>Adicionar</button>
      </div>

      <div className="grid-3">
        {items.map(item => (
          <ItemCard
            key={item.id}
            title={item.nome}
            subtitle={`${item._aeronaveName} · ${item.status}`}
            onClick={() => setViewItem(item)}
            onEdit={() => openEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>

      {viewItem && (
        <Modal title="Detalhes da Peça" onClose={() => setViewItem(null)}>
          <div className="modal-field">
            <label>Nome</label>
            <input value={viewItem.nome} readOnly />
          </div>
          <div className="modal-field">
            <label>Aeronave</label>
            <input value={viewItem._aeronaveName} readOnly />
          </div>
          <div className="modal-field">
            <label>Tipo</label>
            <input value={viewItem.tipo} readOnly />
          </div>
          <div className="modal-field">
            <label>Fornecedor</label>
            <input value={viewItem.fornecedor} readOnly />
          </div>
          <div className="modal-field">
            <label>Status</label>
            <input value={viewItem.status} readOnly />
          </div>
        </Modal>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Adicionar Peça' : 'Atualizar Status'} onClose={() => setModal(null)}>
          {modal === 'add' ? (
            <>
              <div className="modal-field">
                <label>Nome</label>
                <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Ex: Motor CFM56" />
              </div>
              <div className="modal-field">
                <label>Aeronave</label>
                <select value={form.aeronaveCodigo} onChange={e => setForm(f => ({ ...f, aeronaveCodigo: e.target.value }))}>
                  {aeronaves.map(a => <option key={a.codigo} value={a.codigo}>{a.modelo} ({a.codigo})</option>)}
                </select>
              </div>
              <div className="modal-field">
                <label>Tipo</label>
                <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                  <option value="NACIONAL">NACIONAL</option>
                  <option value="IMPORTADA">IMPORTADA</option>
                </select>
              </div>
              <div className="modal-field">
                <label>Fornecedor</label>
                <input value={form.fornecedor} onChange={e => setForm(f => ({ ...f, fornecedor: e.target.value }))} placeholder="Ex: GE Aviation" />
              </div>
              <div className="modal-field">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="EM_PRODUCAO">EM PRODUÇÃO</option>
                  <option value="EM_TRANSPORTE">EM TRANSPORTE</option>
                  <option value="PRONTA">PRONTA</option>
                </select>
              </div>
            </>
          ) : (
            <div className="modal-field">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="EM_PRODUCAO">EM PRODUÇÃO</option>
                <option value="EM_TRANSPORTE">EM TRANSPORTE</option>
                <option value="PRONTA">PRONTA</option>
              </select>
            </div>
          )}
          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </Modal>
      )}
    </Layout>
  )
}
