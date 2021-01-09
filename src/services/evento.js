import API from './api'

export default class EventoService {
  getAll() {
    return API.get('eventos')
  }
}