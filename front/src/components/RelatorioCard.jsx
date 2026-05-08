import { fmtNumber } from '../utils/masks'
import '../pages/RelatorioCard.css'

const STATUS_ETAPA = { PENDENTE: 'Pendente', ANDAMENTO: 'Em Andamento', CONCLUIDA: 'Concluída' }
const STATUS_PECA  = { DISPONIVEL: 'Disponível', EM_USO: 'Em Uso', DEFEITO: 'Defeito' }
const RESULTADO    = { APROVADO: 'Aprovado', REPROVADO: 'Reprovado', PENDENTE: 'Pendente' }

function StatusBadge({ value, map }) {
  const label = map[value] || value
  const cls = `rel-badge rel-badge--${value.toLowerCase().replace('_', '-')}`
  return <span className={cls}>{label}</span>
}

export default function RelatorioCard({ data }) {
  const geradoEm = new Date(data.geradoEm).toLocaleString('pt-BR')

  return (
    <div className="rel-card">
      <div className="rel-header">
        <div>
          <h2 className="rel-title">Relatório Final de Aeronave</h2>
          <p className="rel-subtitle">AeroCode · gerado em {geradoEm}</p>
        </div>
      </div>

      <div className="rel-grid-2">
        <section className="rel-section">
          <h3 className="rel-section-title">Aeronave</h3>
          <dl className="rel-dl">
            <dt>Código</dt>    <dd>{data.aeronave.codigo}</dd>
            <dt>Modelo</dt>    <dd>{data.aeronave.modelo}</dd>
            <dt>Tipo</dt>      <dd>{data.aeronave.tipo}</dd>
            <dt>Capacidade</dt><dd>{fmtNumber(data.aeronave.capacidade)} passageiros</dd>
            <dt>Alcance</dt>   <dd>{fmtNumber(data.aeronave.alcance)} km</dd>
          </dl>
        </section>

        <section className="rel-section">
          <h3 className="rel-section-title">Entrega</h3>
          <dl className="rel-dl">
            <dt>Cliente</dt>        <dd>{data.entrega.cliente}</dd>
            <dt>Data de entrega</dt><dd>{data.entrega.dataEntrega}</dd>
          </dl>
        </section>
      </div>

      <section className="rel-section">
        <h3 className="rel-section-title">Peças ({data.pecas.length})</h3>
        {data.pecas.length === 0 ? (
          <p className="rel-empty">Nenhuma peça registrada.</p>
        ) : (
          <table className="rel-table">
            <thead><tr><th>Nome</th><th>Tipo</th><th>Fornecedor</th><th>Status</th></tr></thead>
            <tbody>
              {data.pecas.map((p, i) => (
                <tr key={i}>
                  <td>{p.nome}</td><td>{p.tipo}</td><td>{p.fornecedor}</td>
                  <td><StatusBadge value={p.status} map={STATUS_PECA} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rel-section">
        <h3 className="rel-section-title">Etapas ({data.etapas.length})</h3>
        {data.etapas.length === 0 ? (
          <p className="rel-empty">Nenhuma etapa registrada.</p>
        ) : (
          <div className="rel-etapas">
            {data.etapas.map((e, i) => (
              <div key={i} className="rel-etapa">
                <div className="rel-etapa-header">
                  <span className="rel-etapa-nome">{i + 1}. {e.nome}</span>
                  <StatusBadge value={e.status} map={STATUS_ETAPA} />
                </div>
                <p className="rel-etapa-prazo">Prazo: {e.prazo}</p>
                {e.funcionarios.length > 0 && (
                  <div className="rel-etapa-funcs">
                    {e.funcionarios.map((f, j) => (
                      <span key={j} className="rel-func-chip">{f.nome}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rel-section">
        <h3 className="rel-section-title">Testes ({data.testes.length})</h3>
        {data.testes.length === 0 ? (
          <p className="rel-empty">Nenhum teste registrado.</p>
        ) : (
          <table className="rel-table">
            <thead><tr><th>Tipo</th><th>Resultado</th></tr></thead>
            <tbody>
              {data.testes.map((t, i) => (
                <tr key={i}>
                  <td>{t.tipo}</td>
                  <td><StatusBadge value={t.resultado} map={RESULTADO} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
