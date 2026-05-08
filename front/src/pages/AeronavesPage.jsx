import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import ItemRow from '../components/ItemRow'
import Modal from '../components/Modal'
import { aeronavesApi } from '../services/api'
import './Page.css'

const FORM_INITIAL = { codigo: '', modelo: '', tipo: 'COMERCIAL', capacidade: '', alcance: '' }

export default function AeronavesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(FORM_INITIAL)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  async function load() {
    try {
      setLoading(true)
      setError(null)
      setItems(await aeronavesApi.list())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setForm(FORM_INITIAL)
    setModal('add')
  }

  function openEdit(item) {
    setForm({ codigo: item.codigo, modelo: item.modelo, tipo: item.tipo, capacidade: String(item.capacidade), alcance: String(item.alcance) })
    setModal(item)
  }

  async function handleDelete(codigo) {
    try {
      await aeronavesApi.delete(codigo)
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const body = { ...form, capacidade: Number(form.capacidade), alcance: Number(form.alcance) }
      if (modal === 'add') {
        await aeronavesApi.create(body)
      } else {
        await aeronavesApi.update(modal.codigo, body)
      }
      setModal(null)
      await load()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Layout title="Aeronaves"><p className="page-loading">Carregando...</p></Layout>
  if (error) return <Layout title="Aeronaves"><p className="page-error">{error}</p></Layout>

  return (
    <Layout title="Aeronaves">
      <div className="page-toolbar">
        <button className="btn-add" onClick={openAdd}>Adicionar</button>
      </div>

      <div className="list">
        {items.map(item => (
          <ItemRow
            key={item.codigo}
            title={`${item.codigo} — ${item.modelo}`}
            subtitle={item.tipo}
            onClick={() => navigate(`/aeronaves/${item.codigo}`)}
            onEdit={() => openEdit(item)}
            onDelete={() => handleDelete(item.codigo)}
          />
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Adicionar Aeronave' : 'Editar Aeronave'} onClose={() => setModal(null)}>
          <div className="modal-field">
            <label>Código</label>
            <input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} placeholder="Ex: A006" disabled={modal !== 'add'} />
          </div>
          <div className="modal-field">
            <label>Modelo</label>
            <input value={form.modelo} onChange={e => setForm(f => ({ ...f, modelo: e.target.value }))} placeholder="Ex: Boeing 737" />
          </div>
          <div className="modal-field">
            <label>Tipo</label>
            <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
              <option value="COMERCIAL">COMERCIAL</option>
              <option value="MILITAR">MILITAR</option>
            </select>
          </div>
          <div className="modal-field">
            <label>Capacidade (passageiros)</label>
            <input type="number" value={form.capacidade} onChange={e => setForm(f => ({ ...f, capacidade: e.target.value }))} placeholder="180" />
          </div>
          <div className="modal-field">
            <label>Alcance (km)</label>
            <input type="number" value={form.alcance} onChange={e => setForm(f => ({ ...f, alcance: e.target.value }))} placeholder="5600" />
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
