import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ItemRow from '../components/ItemRow'
import Modal from '../components/Modal'
import { funcionariosApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { maskPhone } from '../utils/masks'
import './Page.css'

const FORM_INITIAL = { nome: '', usuario: '', senha: '', nivelPermissao: 'OPERADOR', telefone: '', endereco: '' }

export default function FuncionariosPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
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
      setItems(await funcionariosApi.list())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.nivelPermissao === 'ADMINISTRADOR') load()
    else setLoading(false)
  }, [user])

  if (user?.nivelPermissao !== 'ADMINISTRADOR') {
    return (
      <Layout title="Funcionários">
        <p className="page-error">Acesso restrito a administradores.</p>
      </Layout>
    )
  }

  function openAdd() {
    setForm(FORM_INITIAL)
    setModal('add')
  }

  async function handleDelete(id) {
    try {
      await funcionariosApi.delete(id)
      await load()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      await funcionariosApi.create(form)
      setModal(null)
      await load()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Layout title="Funcionários"><p className="page-loading">Carregando...</p></Layout>
  if (error) return <Layout title="Funcionários"><p className="page-error">{error}</p></Layout>

  return (
    <Layout title="Funcionários">
      <div className="page-toolbar">
        <button className="btn-add" onClick={openAdd}>Adicionar</button>
      </div>

      <div className="list">
        {items.map(item => (
          <ItemRow
            key={item.id}
            title={item.nome}
            subtitle={`${item.nivelPermissao} · ${item.telefone}`}
            onClick={() => setViewItem(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>

      {viewItem && (
        <Modal title="Detalhes do Funcionário" onClose={() => setViewItem(null)}>
          <div className="modal-field">
            <label>Nome</label>
            <input value={viewItem.nome} readOnly />
          </div>
          <div className="modal-field">
            <label>Usuário</label>
            <input value={viewItem.usuario} readOnly />
          </div>
          <div className="modal-field">
            <label>Nível</label>
            <input value={viewItem.nivelPermissao} readOnly />
          </div>
          <div className="modal-field">
            <label>Telefone</label>
            <input value={viewItem.telefone || ''} readOnly />
          </div>
          <div className="modal-field">
            <label>Endereço</label>
            <input value={viewItem.endereco || ''} readOnly />
          </div>
        </Modal>
      )}

      {modal === 'add' && (
        <Modal title="Adicionar Funcionário" onClose={() => setModal(null)}>
          <div className="modal-field">
            <label>Nome</label>
            <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome completo" />
          </div>
          <div className="modal-field">
            <label>Usuário</label>
            <input value={form.usuario} onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))} placeholder="Login" />
          </div>
          <div className="modal-field">
            <label>Senha</label>
            <input type="password" value={form.senha} onChange={e => setForm(f => ({ ...f, senha: e.target.value }))} placeholder="••••••••" />
          </div>
          <div className="modal-field">
            <label>Nível</label>
            <select value={form.nivelPermissao} onChange={e => setForm(f => ({ ...f, nivelPermissao: e.target.value }))}>
              <option value="ADMINISTRADOR">ADMINISTRADOR</option>
              <option value="ENGENHEIRO">ENGENHEIRO</option>
              <option value="OPERADOR">OPERADOR</option>
            </select>
          </div>
          <div className="modal-field">
            <label>Telefone</label>
            <input value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: maskPhone(e.target.value) }))} placeholder="(11) 99999-0000" inputMode="tel" />
          </div>
          <div className="modal-field">
            <label>Endereço</label>
            <input value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} placeholder="Localização" />
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
