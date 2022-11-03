import React, { useEffect, useState } from "react";
import { withSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import { useParams } from "react-router-dom";

import history from "../../../history";
import api from "../../../services/api";

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

function CityServices({ enqueueSnackbar }) {
  const { city_id } = useParams();
  const classes = useStyles();
  const [city, setCity] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    let services,
      cityServices = [];

    await api.get("/service").then((response) => {
      services = response.data;
      services.map((service) => {
        cityServices.push({
          city_id,
          service_id: service.id,
          name: service.name,
          price: 0,
        });
      });
    });

    await api.get(`/city/${city_id}`).then(async (response) => {
      const city = response.data[0];
      setCity(city);

      cityServices.map((service, index) => {
        const cityService = response.data[0].services.filter(serviceCity => {
          return serviceCity.pivot.service_id == service.service_id
        }) 
        
        service.price = cityService[0] ? cityService[0].pivot.price : 0
      });

      setServices(cityServices);
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
      .put(`/city/${city_id}`, { 
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
        Serviços
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
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
        </Grid>

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
              history.push("/admin/city");
            }}
          >
            Voltar
          </Button>
        </Grid>
      </form>
    </Paper>
  );
}

export default withSnackbar(CityServices);
