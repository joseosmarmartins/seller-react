import React, { Component } from 'react'

import PedidoService from '../services/pedido'

import { DataGrid } from '@material-ui/data-grid';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

class Pedidos extends Component {
  state = {
    columns: [
      { field: 'id', headerName: 'ID', width: 70 },
      {
        field: 'numero',
        headerName: 'Número',
        type: 'number',
        width: 120,
      },
      {
        field: 'produtosStr',
        headerName: 'Produtos',
        type: 'string',
        width: 470
      },
      {
        field: 'valorFormatado',
        headerName: 'Valor',
        type: 'string',
        width: 120,
      }
    ],
    pedidos: []
  }
  async componentDidMount() {
    const res = await new PedidoService().getPedidosValorTotalMaiorIgualQuinhentos();
    res.data.forEach(r => {
      r.produtosStr = r.produtos.map(item => item.nome).join(", ")
      r.valorFormatado = `R$ ${(r.valorTotal / 100).toFixed(2)}`
    });
    this.setState({ pedidos: res.data })
  }
  render() {
    const downloadCSV = () => {
      const results = []
      this.state.pedidos.forEach(pedido => {
        const r = {
          ID: pedido.id,
          Número: pedido.numero,
          Produtos: pedido.produtosStr,
          Valor: pedido.valorFormatado
        }
        results.push(r)
      })

      const blob = new Blob([toCSV(results)], {
        type: 'text/plain; encoding=utf8'
      })

      const a = document.createElement('a')
      document.lastChild.appendChild(a)
      a.style = 'display: none'

      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = 'pedidos.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    }
    const toCSV = (json) => {
      const replacer = (key, value) => (value == null ? '' : value)
      const header = Object.keys(json[0])
      let csv = json.map(row =>
        header
          .map(fieldName => JSON.stringify(row[fieldName], replacer))
          .join(';')
      )
      csv.unshift(header.join(';'))
      csv = csv.join('\r\n')

      return csv
    }
    return (
      <div style={{ height: 400, width: 800 }}>
        <h2>Pedidos</h2>
        <DataGrid rows={this.state.pedidos} columns={this.state.columns} />
        <Grid container>
          <Button style={{ top: 410, left: 0, background: '#5cb85c', color: 'white' }} color="inherit" variant="contained" onClick={downloadCSV}>
            Download CSV
        </Button>
        </Grid>
      </div>
    )
  }
}
export default Pedidos;