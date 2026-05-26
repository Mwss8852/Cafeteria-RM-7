import api from './axios'

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

export const produtosAPI = {
  listar: () => api.get('/produtos'),
  listarTodos: () => api.get('/produtos/todos'),
  buscar: (id) => api.get(`/produtos/${id}`),
  porCategoria: (cat) => api.get(`/produtos/categoria/${cat}`),
  criar: (data) => api.post('/produtos', data),
  atualizar: (id, data) => api.put(`/produtos/${id}`, data),
  deletar: (id) => api.delete(`/produtos/${id}`),
}

export const pedidosAPI = {
  criar: (data) => api.post('/pedidos', data),
  meus: () => api.get('/pedidos/meus'),
  buscar: (id) => api.get(`/pedidos/${id}`),
  todos: () => api.get('/pedidos'),
  porStatus: (status) => api.get(`/pedidos/status/${status}`),
  atualizarStatus: (id, status) => api.patch(`/pedidos/${id}/status?status=${status}`),
  cancelar: (id) => api.patch(`/pedidos/${id}/cancelar`),
}
