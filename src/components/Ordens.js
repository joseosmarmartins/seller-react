import React, { Component } from 'react'

import OrdemService from '../services/ordem'

import { DataGrid } from '@material-ui/data-grid';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

class Ordens extends Component {
  state = {
    columns: [
      { field: 'id', headerName: 'ID', width: 70 },
      {
        field: 'pedidoId',
        headerName: 'Nº Pedido',
        type: 'number',
        width: 120,
      },
      {
        field: 'statusName',
        headerName: 'Status',
        type: 'string',
        width: 120,
      },
      {
        field: 'produtosStr',
        headerName: 'Produtos',
        type: 'string',
        width: 470
      }
    ],
    ordens: [],
    selecionadas: []
  }
  async componentDidMount() {
    const res = await new OrdemService().getAll();
    res.data.forEach(r => {
      r.pedidoId = r.pedido.id
      r.produtosStr = r.pedido.produtos.map(item => item.nome).join(", ")
      r.statusName = r.status === 'PENDING' ? 'Pendente' : 'Inicializada'
    });
    this.setState({ ordens: res.data })
  }
  render() {
    const setSelection = (selection) => {
      this.setState({ selecionadas: selection })
    }
    const iniciarTransporte = async () => {
      for (const selecionada of this.state.selecionadas) {
        await new OrdemService().iniciarTransporte(parseInt(selecionada));
      }
      getAll();
    }
    const getAll = async () => {
      const res = await new OrdemService().getAll();
      res.data.forEach(r => {
        r.pedidoId = r.pedido.id
        r.produtosStr = r.pedido.produtos.map(item => item.nome).join(", ")
        r.statusName = r.status === 'PENDING' ? 'Pendente' : 'Inicializada'
      });
      this.setState({ ordens: res.data, selecionadas: [] })
    }
    return (
      <div style={{ height: 400, width: 800 }}>
        <h2>Ordens</h2>
        <DataGrid rows={this.state.ordens} columns={this.state.columns} checkboxSelection onSelectionChange={(newSelection) => { setSelection(newSelection.rowIds); }} />
        <Grid container>
          <Button style={{ top: 410, left: 0, background: '#5cb85c', color: 'white' }} color="inherit" variant="contained" onClick={iniciarTransporte}>
            Iniciar transporte de ordens selecionadas
        </Button>
        </Grid>
      </div >
    )
  }
}
export default Ordens;