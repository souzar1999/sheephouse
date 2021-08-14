import React, { useEffect, useState } from "react";
import { withSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import { useParams } from "react-router-dom";

import api from "../../../services/api";
import history from "../../../history";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  grid: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function BrokerServices({ enqueueSnackbar }) {
  const { broker_id } = useParams();
  const classes = useStyles();
  const [broker, setBroker] = useState([]);
  const [services, setServices] = useState([]);
  const [cnpj, setCnpj] = useState("");
  const [emitir_nf, setEmitirNf] = useState(false);
  const [enviar_boleto, setEnviarBoleto] = useState(false);
  const [enviar_nf, setEnviarNf] = useState(false);
  const [enviar_relatorio, setEnviarRelatorio] = useState(false);
  const [dia_vencimento, setDiaVencimento] = useState("");

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    let services,
      brokerServices = [];
    await api.get("/service").then((response) => {
      services = response.data;
      services.map((service) => {
        brokerServices.push({
          broker_id,
          service_id: service.id,
          name: service.name,
          price: 0,
        });
      });
    });

    await api.get(`/broker/${broker_id}`).then((response) => {
      setBroker(response.data[0]);
      setCnpj(response.data[0].cnpj);
      setEmitirNf(response.data[0].emitir_nf);
      setEnviarBoleto(response.data[0].enviar_boleto);
      setEnviarNf(response.data[0].enviar_nf);
      setEnviarRelatorio(response.data[0].enviar_relatorio);
      setDiaVencimento(response.data[0].dia_vencimento);

      brokerServices.map((service, index) => {
        const priceService = response.data[0].services.filter(serviceBroker => {
          return serviceBroker.pivot.service_id == service.service_id
        })[0].pivot.price; 
        
        service.price = priceService ? priceService : 0;
      });

      setServices(brokerServices);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    let codServicos = [],
      prices = [];

    services.map((service) => {
      codServicos.push(service.service_id);
      prices.push(service.price);
    });

    await api
      .put(`/broker/${broker.id}`, {
        name: broker.name,
        email: broker.email,
        cnpj,
        emitir_nf,
        enviar_boleto,
        enviar_nf,
        enviar_relatorio,
        dia_vencimento,
        services: codServicos,
        prices,
      })
      .then((response) => {
        enqueueSnackbar("Registro atualizado com sucesso!", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });

        handleLoad();
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao atualizar registro!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      });
  }

  return (
    <Paper className={classes.paper}>
      <Typography className={classes.title} component="h5" variant="h5">
        Imobiliária: {broker.name}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="text"
              onChange={(event) => {
                setCnpj(event.target.value);
              }}
              value={cnpj}
              label="CPF/CNPJ"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="number"
              onChange={(event) => {
                setDiaVencimento(event.target.value);
              }}
              value={dia_vencimento}
              label="Dia de Vencimento"
              variant="outlined"
              fullWidth
              min="0"
              max="31"
            />
          </Grid>
          <Grid container item xs={12} justify="flex-start">
            <FormControlLabel
              control={
                <Checkbox
                  checked={emitir_nf}
                  name={`emitir_nf`}
                  color="primary"
                  onChange={() => {
                    setEmitirNf(!emitir_nf);
                  }}
                />
              }
              label="Emitir NF"
            />
          </Grid>
          <Grid container item xs={12} justify="flex-start">
            <FormControlLabel
              control={
                <Checkbox
                  checked={enviar_boleto}
                  name={`enviar_boleto`}
                  color="primary"
                  onChange={() => {
                    setEnviarBoleto(!enviar_boleto);
                  }}
                />
              }
              label="Enviar Boleto"
            />
          </Grid>
          <Grid container item xs={12} justify="flex-start">
            <FormControlLabel
              control={
                <Checkbox
                  checked={enviar_nf}
                  name={`enviar_nf`}
                  color="primary"
                  onChange={() => {
                    setEnviarNf(!enviar_nf);
                  }}
                />
              }
              label="Enviar NF"
            />
          </Grid>
          <Grid container item xs={12} justify="flex-start">
            <FormControlLabel
              control={
                <Checkbox
                  checked={enviar_relatorio}
                  name={`enviar_relatorio`}
                  color="primary"
                  onChange={() => {
                    setEnviarRelatorio(!enviar_relatorio);
                  }}
                />
              }
              label="Enviar Relatório"
            />
          </Grid>
          <Typography component="h6" variant="h6">
            Valor do Serviços
          </Typography>
          {services.map((service, index) => {
            return (
              <Grid item xs={12} key={index}>
                <TextField
                  type="text"
                  onChange={(event) => {
                    let newServices = services;

                    newServices[index].price = event.target.value;

                    setServices([...newServices]);
                  }}
                  value={service.price}
                  label={`Valor: ${service.name}`}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            );
          })}
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="small"
              className={classes.submit}
            >
              Salvar
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => {
                history.push("/admin/broker");
              }}
            >
              Voltar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default withSnackbar(BrokerServices);
