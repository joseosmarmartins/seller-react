import API from './api'

export default class OrdemService {
  getAll() {
    return API.get('ordens')
  }
  iniciarTransporte(id) {
    return API.patch("ordens/" + id, { id: id })
  }
}