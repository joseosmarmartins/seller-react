import API from './api'

export default class ProdutoService {
  getAll() {
    return API.get('produtos')
  }
}