import React, { useEffect, useState } from "react";
import { withSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
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
    minWidth: "300px",
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
    await api.get(`/city/${city_id}`).then(async (response) => {
      const city = response.data[0];
      setCity(city);

      await api.get("/service").then((response) => {
        let services = response.data;

        services.map((service) => {
          service.checked = false;
          city.services.map((cityServ) => {
            if (cityServ.id == service.id) service.checked = true;
          });
        });

        setServices(response.data);
      });
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let codServicos = [];

    services.map((service) => {
      if (service.checked) {
        codServicos.push(service.id);
      }
    });

    await api
      .put(`/city/${city_id}`, { services: codServicos })
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
        {services.map((service) => {
          return (
            <Grid className={classes.grid} item xs={12} key={service.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={service.checked}
                    onChange={(event) => {
                      let newServices = services;

                      newServices.map((item) => {
                        if (item.id == event.target.value) {
                          if (item.checked) {
                            item.checked = false;
                          } else {
                            item.checked = true;
                          }
                        }
                      });

                      setServices([...newServices]);
                    }}
                    name={`services[${service.id}]`}
                    id={`service${service.id}`}
                    color="primary"
                    value={service.id}
                  />
                }
                label={service.name}
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
