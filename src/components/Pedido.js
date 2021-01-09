import React, { Component } from 'react'

import ProdutoService from '../services/produto'
import PedidoService from '../services/pedido'

import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';

const useStyles = theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
});

class Pedido extends Component {
  state = {
    produtos: [],
    produtosSelecionados: [],
    produto: null,
    total: 0,
    success: false,
    error: false
  }
  async componentDidMount() {
    const res = await new ProdutoService().getAll();
    this.setState({ produtos: res.data })

    this.initialState = JSON.parse(JSON.stringify(this.state))
  }
  render() {
    const { classes } = this.props;

    const handleChange = (event) => {
      let total = this.state.total
      let produtosSelecionados = this.state.produtosSelecionados
      if (this.state.produtosSelecionados.length < 3) {
        produtosSelecionados.push(event.target.value);
        total += event.target.value.valor
      }
      event.target.value = null

      produtosSelecionados = JSON.parse(JSON.stringify(produtosSelecionados))
      this.setState({ produtosSelecionados: produtosSelecionados, total: total })
    };
    const finish = async () => {
      try {
        await new PedidoService().save({ produtos: this.state.produtosSelecionados });
        this.setState({ produtosSelecionados: [], total: 0, success: true, error: false })
      } catch (e) {
        this.setState({ success: false, error: true })
      }
    };
    const renderAlert = () => {
      if (!this.state.success && !this.state.error) return
      if (this.state.success && !this.state.error) {
        return (<div className={classes.root}>
          <Alert severity="success">Pedido realizado! Ordem de transporte pronta para ser Iniciada</Alert>
        </div>)
      }
      return (<div className={classes.root}>
        <Alert severity="error">Erro ao realizar pedido</Alert>
      </div>)
    }

    return (
      <div>
        <h2>Fazer Pedido</h2>
        <Grid container>
          <Grid item xs={6} container spacing={2}>
            <Grid item xs={12}>
              <FormControl className={classes.formControl}
                fullWidth>
                <InputLabel id="demo-controlled-open-select-label">Produto</InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  value={this.state.produto}
                  onChange={handleChange}
                >
                  {this.state.produtos.map(item => {
                    return <MenuItem value={item}>
                      <em>{item.nome}</em>
                      <em> - R$ {(item.valor / 100).toFixed(2)}</em>
                    </MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} container spacing={1}>
              {this.state.produtosSelecionados.map((item, index) => {
                return <Grid item xs={12}><TextField
                  fullWidth
                  id="filled-read-only-input"
                  label={"Item" + (index + 1)}
                  defaultValue="Hello World"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={item.nome + " - R$ " + (item.valor / 100).toFixed(2)}
                  variant="filled"
                /></Grid>
              })}
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="filled-read-only-input"
                  label={"Total"}
                  defaultValue="Hello World"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={"R$ " + (this.state.total / 100).toFixed(2)}
                  variant="filled"
                />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Button className={classes.button} color="primary" variant="contained" disableElevation={this.state.produtosSelecionados > 1 && this.state.produtosSelecionados > 4} onClick={finish}>
                Fazer Pedido
      </Button>
            </Grid>
            <Grid item xs={6}>
              <Button className={classes.button} color="secondary" variant="contained" onClick={() => this.setState({ produtosSelecionados: [], total: 0 })}>
                Cancelar Pedido
      </Button>
            </Grid>

            {renderAlert()}

          </Grid>
        </Grid>
      </div>
    )
  }
}
export default withStyles(useStyles)(Pedido);