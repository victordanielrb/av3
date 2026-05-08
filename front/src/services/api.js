const BASE = '/api'

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('token')
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/'
    return
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || data.message || `HTTP ${res.status}`)
  }

  return data
}

const api = {
  get:    (path)       => request('GET',    path),
  post:   (path, body) => request('POST',   path, body),
  put:    (path, body) => request('PUT',    path, body),
  patch:  (path, body) => request('PATCH',  path, body),
  delete: (path)       => request('DELETE', path),
}

export const authApi = {
  login: (usuario, senha) => api.post('/auth/login', { usuario, senha }),
}

export const aeronavesApi = {
  list:   ()              => api.get('/aeronaves'),
  get:    (codigo)        => api.get(`/aeronaves/${codigo}`),
  create: (body)          => api.post('/aeronaves', body),
  update: (codigo, body)  => api.put(`/aeronaves/${codigo}`, body),
  delete: (codigo)        => api.delete(`/aeronaves/${codigo}`),
}

export const pecasApi = {
  listByAeronave: (codigo)        => api.get(`/aeronaves/${codigo}/pecas`),
  create:         (codigo, body)  => api.post(`/aeronaves/${codigo}/pecas`, body),
  updateStatus:   (id, status)    => api.patch(`/pecas/${id}/status`, { status }),
  delete:         (id)            => api.delete(`/pecas/${id}`),
}

export const etapasApi = {
  listByAeronave:  (codigo)       => api.get(`/aeronaves/${codigo}/etapas`),
  create:          (codigo, body) => api.post(`/aeronaves/${codigo}/etapas`, body),
  iniciar:         (id)           => api.patch(`/etapas/${id}/iniciar`),
  finalizar:       (id)           => api.patch(`/etapas/${id}/finalizar`),
  delete:          (id)           => api.delete(`/etapas/${id}`),
  addFuncionario:    (id, fid)    => api.post(`/etapas/${id}/funcionarios`, { funcionarioId: fid }),
  listFuncionarios:  (id)         => api.get(`/etapas/${id}/funcionarios`),
  removeFuncionario: (id, fid)    => api.delete(`/etapas/${id}/funcionarios/${fid}`),
}

export const testesApi = {
  listByAeronave: (codigo)       => api.get(`/aeronaves/${codigo}/testes`),
  create:         (codigo, body) => api.post(`/aeronaves/${codigo}/testes`, body),
  delete:         (id)           => api.delete(`/testes/${id}`),
}

export const funcionariosApi = {
  me:     ()     => api.get('/funcionarios/me'),
  list:   ()     => api.get('/funcionarios'),
  create: (body) => api.post('/funcionarios', body),
  delete: (id)   => api.delete(`/funcionarios/${id}`),
}

export const relatoriosApi = {
  gerar:  (codigo, cliente, dataEntrega) =>
    api.get(`/relatorios/${codigo}?cliente=${encodeURIComponent(cliente)}&dataEntrega=${encodeURIComponent(dataEntrega)}`),
  salvar: (body) => api.post('/relatorios', body),
  listar: ()     => api.get('/relatorios/saved'),
}
