import React, { Component } from 'react'

import EventoService from '../services/evento'

import { DataGrid } from '@material-ui/data-grid';

class Eventos extends Component {
  state = {
    columns: [
      {
        field: 'data',
        headerName: 'Data',
        type: 'date',
        width: 190,
      },
      {
        field: 'status',
        headerName: 'Status',
        type: 'string',
        width: 120,
      },
      {
        field: 'descricao',
        headerName: 'Descrição',
        type: 'string',
        width: 480
      }
    ],
    eventos: []
  }
  async componentDidMount() {
    const res = await new EventoService().getAll();
    res.data.forEach((r, i) => {
      r.id = i
      r.status = r.eventoJsonAuxiliar.sucesso ? "Sucesso" : "Erro"
      r.data = new Date(r.eventoJsonAuxiliar.data)
      r.descricao = r.eventoJsonAuxiliar.descricao
    });
    this.setState({ eventos: res.data })
  }
  render() {
    return (
      <div style={{ height: 400, width: 800 }}>
        <h2>Eventos</h2>
        <DataGrid rows={this.state.eventos} columns={this.state.columns} />
      </div>
    )
  }
}
export default Eventos;