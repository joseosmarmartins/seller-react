import API from './api'

export default class PedidoService {
  save(pedido) {
    return API.post('pedidos', pedido)
  }
  getPedidosValorTotalMaiorIgualQuinhentos() {
    return API.get('pedidos/valorTotalMaiorIgualQuinhentos')
  }
}