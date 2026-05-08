import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ItemRow from '../components/ItemRow'
import Modal from '../components/Modal'
import RelatorioCard from '../components/RelatorioCard'
import { aeronavesApi, relatoriosApi } from '../services/api'
import { maskDate } from '../utils/masks'
import './Page.css'

export default function RelatoriosPage() {
  const [aeronaves, setAeronaves] = useState([])
  const [salvos, setSalvos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // gerar
  const [gerarModal, setGerarModal] = useState(null)
  const [form, setForm] = useState({ cliente: '', dataEntrega: '' })
  const [gerando, setGerando] = useState(false)
  const [relatorioGerado, setRelatorioGerado] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [savedMsg, setSavedMsg] = useState(null)

  // view salvo
  const [viewDados, setViewDados] = useState(null)

  useEffect(() => {
    Promise.all([aeronavesApi.list(), relatoriosApi.listar()])
      .then(([avs, rs]) => { setAeronaves(avs); setSalvos(rs) })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function openGerar(aeronave) {
    setForm({ cliente: '', dataEntrega: '' })
    setRelatorioGerado(null)
    setSavedMsg(null)
    setGerarModal(aeronave)
  }

  async function handleGerar() {
    setGerando(true); setSavedMsg(null)
    try {
      setRelatorioGerado(await relatoriosApi.gerar(gerarModal.codigo, form.cliente, form.dataEntrega))
    } catch (err) {
      alert(err.message)
    } finally {
      setGerando(false)
    }
  }

  async function handleSalvar() {
    if (!relatorioGerado) return
    setSalvando(true); setSavedMsg(null)
    try {
      await relatoriosApi.salvar({
        aeronaveCodigo: gerarModal.codigo,
        cliente: form.cliente,
        dataEntrega: form.dataEntrega,
        dados: JSON.stringify(relatorioGerado),
        geradoEm: relatorioGerado.geradoEm,
      })
      const updated = await relatoriosApi.listar()
      setSalvos(updated)
      setSavedMsg('Relatório salvo.')
    } catch (err) {
      alert(err.message)
    } finally {
      setSalvando(false)
    }
  }

  if (loading) return <Layout title="Relatórios"><p className="page-loading">Carregando...</p></Layout>
  if (error)   return <Layout title="Relatórios"><p className="page-error">{error}</p></Layout>

  return (
    <Layout title="Relatórios">
      <p className="page-hint">Selecione uma aeronave para gerar um relatório.</p>

      <div className="list">
        {aeronaves.map(av => (
          <ItemRow
            key={av.codigo}
            title={`${av.codigo} — ${av.modelo}`}
            subtitle={av.tipo}
            extraActions={
              <button className="btn-download" onClick={e => { e.stopPropagation(); openGerar(av) }}>
                Gerar Relatório
              </button>
            }
          />
        ))}
      </div>

      {salvos.length > 0 && (
        <>
          <h3 className="rel-list-title">Relatórios Salvos</h3>
          <div className="list">
            {salvos.map(r => (
              <ItemRow
                key={r.id}
                title={`${r.aeronaveCodigo} — ${r.cliente}`}
                subtitle={`Entrega: ${r.dataEntrega} · ${new Date(r.geradoEm).toLocaleString('pt-BR')}`}
                onClick={() => setViewDados(r.dados)}
              />
            ))}
          </div>
        </>
      )}

      {gerarModal && (
        <Modal title={`Gerar Relatório — ${gerarModal.modelo}`} onClose={() => setGerarModal(null)} wide>
          <div className="modal-field">
            <label>Cliente</label>
            <input value={form.cliente} onChange={e => setForm(f => ({ ...f, cliente: e.target.value }))} placeholder="Nome do cliente" />
          </div>
          <div className="modal-field">
            <label>Data de Entrega</label>
            <input value={form.dataEntrega} onChange={e => setForm(f => ({ ...f, dataEntrega: maskDate(e.target.value) }))} placeholder="dd/mm/aaaa" inputMode="numeric" />
          </div>
          {savedMsg && <p style={{ color: '#16a34a', fontSize: '0.875rem', margin: 0 }}>{savedMsg}</p>}
          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => setGerarModal(null)}>Fechar</button>
            {relatorioGerado && (
              <button className="btn-cancel" onClick={handleSalvar} disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            )}
            <button className="btn-save" onClick={handleGerar} disabled={gerando || !form.cliente || !form.dataEntrega}>
              {gerando ? 'Gerando...' : 'Gerar'}
            </button>
          </div>
          {relatorioGerado && <RelatorioCard data={relatorioGerado} />}
        </Modal>
      )}

      {viewDados && (
        <Modal title={`Relatório — ${viewDados.aeronave?.modelo || ''}`} onClose={() => setViewDados(null)} wide>
          <RelatorioCard data={viewDados} />
          <div className="modal-actions">
            <button className="btn-save" onClick={() => setViewDados(null)}>Fechar</button>
          </div>
        </Modal>
      )}
    </Layout>
  )
}
