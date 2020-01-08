import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";

import api from "../../../services/api";

import Maps from "./Maps";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function Scheduling({ enqueueSnackbar, clientCode }) {
  const classes = useStyles();

  const [step, setStep] = useState(2);

  const [address, setAddress] = useState("");
  const [complement, setComplement] = useState("");
  const [date, setDate] = useState("");
  const [accompanies, setAccompanies] = useState(false);
  const [horaries, setHoraries] = useState([]);
  const [horary_id, setHoraryId] = useState("");
  const [city_id, setCityId] = useState("");
  const [district_id, setDistrictId] = useState("");
  const [region_id, setRegionId] = useState("");
  const [photographer_id, setPhotographerId] = useState("");

  const [latitude, setLat] = useState("");
  const [longitude, setLng] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const client_id = clientCode;
  const drone = false;

  const [labelWidth, setLabelWidth] = useState(0);
  const inputLabel = React.useRef(null);

  useEffect(() => {
    getHoraries();

    if (step === 1) {
      setLabelWidth(inputLabel.current.offsetWidth);
    }
  }, [enqueueSnackbar, step]);

  async function getHoraries() {
    await api.get("/horary").then(response => {
      setHoraries(response.data);
    });
  }

  function getStateAddress() {
    setAddress(localStorage.getItem("address"));
    setCity(localStorage.getItem("city"));
    setDistrict(localStorage.getItem("district"));
    setLat(localStorage.getItem("lat"));
    setLng(localStorage.getItem("lng"));
  }

  function handleReturnStep() {
    setStep(step - 1);
  }

  async function handleSubmitStep0(event) {
    event.preventDefault();

    if (!address) {
      enqueueSnackbar("Necessário informar endereço para prosseguir", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }
    await api
      .post(`/city/byName`, { city })
      .then(async response => {
        setCityId(response.data[0].id);
        await api
          .post(`/district/byName`, { district, city_id: response.data[0].id })
          .then(async response => {
            setDistrictId(response.data[0].id);
            setRegionId(response.data[0].region_id);
            await api
              .post(`/photographer/byRegion`, {
                region_id: response.data[0].region_id
              })
              .then(async response => {
                setPhotographerId(response.data[0].id);

                enqueueSnackbar(
                  "Fotográfo foi selecionado pelo endereço informado!",
                  {
                    variant: "success",
                    autoHideDuration: 2500,
                    anchorOrigin: {
                      vertical: "top",
                      horizontal: "center"
                    }
                  }
                );

                setStep(1);
              });
          });
      })
      .catch(error => {
        enqueueSnackbar(
          "Problemas com endereço informado! Entre em contato com o administrador.",
          {
            variant: "error",
            autoHideDuration: 2500,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center"
            }
          }
        );
      });
  }

  async function handleSubmitStep1(event) {
    event.preventDefault();

    enqueueSnackbar("Necessário informar endereço para prosseguir", {
      variant: "error",
      autoHideDuration: 2500,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center"
      }
    });

    setStep(2);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!address) {
      enqueueSnackbar("Informe o endereço!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!date) {
      enqueueSnackbar("Informe a data!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!horary_id) {
      enqueueSnackbar("Selecione o horário!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    await api
      .post("/scheduling", {
        date,
        address,
        latitude,
        longitude,
        accompanies,
        drone,
        horary_id,
        client_id,
        city,
        district,
        complement
      })
      .then(response => {
        enqueueSnackbar("Agendamento realizado com sucesso!", {
          variant: "success",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      })
      .catch(error => {
        enqueueSnackbar("Problemas ao realizar agendamento!", {
          variant: "error",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      });
  }

  if (step === 0) {
    return (
      <form className={classes.form} onSubmit={handleSubmitStep0} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Maps />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              onChange={event => {
                getStateAddress();
                setComplement(event.target.value);
              }}
              value={complement}
              label="Complemento"
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Continuar
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }

  if (step === 1) {
    return (
      <form
        className={classes.form}
        onSubmit={handleSubmitStep1}
        onReset={handleReturnStep}
        noValidate
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="date"
              onChange={event => {
                setDate(event.target.value);
              }}
              value={date}
              label="Data da Sessão"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel ref={inputLabel} id="brokerSelect">
                Horários
              </InputLabel>
              <Select
                id="horarySelect"
                labelWidth={labelWidth}
                value={horary_id}
                onChange={event => {
                  setHoraryId(event.target.value);
                }}
              >
                <MenuItem value="">-- Selecione --</MenuItem>
                {horaries.map(item => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.time}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormGroup row>
              <FormControlLabel
                label="Cliente estará presente na sessão?"
                control={
                  <Checkbox
                    checked={accompanies}
                    onChange={event => {
                      setAccompanies(!accompanies);
                    }}
                    value={accompanies}
                  />
                }
              />
            </FormGroup>
          </Grid>
          <Grid item xs={4}>
            <Button
              type="reset"
              variant="contained"
              color="secondary"
              fullWidth
              className={classes.submit}
            >
              Voltar
            </Button>
          </Grid>
          <Grid item xs={8}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submit}
            >
              Continuar
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
  if (step === 2) {
    return (
      <form className={classes.form} onSubmit={handleSubmitStep1} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="date"
              onChange={event => {
                setDate(event.target.value);
              }}
              value={date}
              label="Data da Sessão"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel ref={inputLabel} id="brokerSelect">
                Horários
              </InputLabel>
              <Select
                id="horarySelect"
                labelWidth={labelWidth}
                value={horary_id}
                onChange={event => {
                  setHoraryId(event.target.value);
                }}
              >
                <MenuItem value="">-- Selecione --</MenuItem>
                {horaries.map(item => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.time}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormGroup row>
              <FormControlLabel
                label="Cliente estará presente na sessão?"
                control={
                  <Checkbox
                    checked={accompanies}
                    onChange={event => {
                      setAccompanies(!accompanies);
                    }}
                    value={accompanies}
                  />
                }
              />
            </FormGroup>
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Cadastrar
        </Button>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  clientCode: state.clientCode
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(Scheduling);
