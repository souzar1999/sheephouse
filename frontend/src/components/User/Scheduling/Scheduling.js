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
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";

import api from "../../../services/api";

import history from "../../../history";

import Maps from "../../Global/Scheduling/Maps";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column"
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function Scheduling({ enqueueSnackbar, clientCode }) {
  const classes = useStyles(),
    [step, setStep] = useState(0),
    [horaries, setHoraries] = useState([]),
    [horary, setHorary] = useState(""),
    [city, setCity] = useState(""),
    [district, setDistrict] = useState(""),
    [formatDate, setFormatDate] = useState(),
    [horaryDisable, setHoraryDisable] = useState(true),
    [events, setEvents] = useState([]),
    [date, setDate] = useState(),
    [latitude, setLat] = useState(""),
    [longitude, setLng] = useState(""),
    [address, setAddress] = useState(""),
    [complement, setComplement] = useState(""),
    [accompanies, setAccompanies] = useState(false),
    drone = false,
    [region_id, setRegionId] = useState(""),
    [city_id, setCityId] = useState(""),
    [district_id, setDistrictId] = useState(""),
    [photographer_id, setPhotographerId] = useState(""),
    [horary_id, setHoraryId] = useState(""),
    client_id = clientCode,
    [labelWidth, setLabelWidth] = useState(0),
    inputLabel = React.useRef(null),
    script = document.createElement("script");

  script.src = "https://apis.google.com/js/client.js";

  useEffect(() => {
    if (step === 1) {
      getHoraries();
      setLabelWidth(inputLabel.current.offsetWidth);
    }
  }, [enqueueSnackbar, step]);

  async function getHoraries() {
    await api.get("/horary/active").then(response => {
      setHoraries(response.data);
    });
  }

  function getAddress(address, lat, lng, city, district) {
    setAddress(address);
    setCity(city);
    setDistrict(district);
    setLat(lat);
    setLng(lng);
  }

  function verifyDate(value) {
    setDate(value);
    setHoraryDisable(true);
    setHoraryId();

    if (Date.parse(value) > Date.now()) {
      getCalendarEvents(value);

      enqueueSnackbar("Carregando horários disponíveis na data selecionada", {
        variant: "success",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });

      setFormatDate(
        value.slice(8, 10) + "/" + value.slice(5, 7) + "/" + value.slice(0, 4)
      );
    }
  }

  function handleReturnStep() {
    setStep(step - 1);
  }

  async function getCalendarEvents(date) {
    await api
      .post(`/calendar/event/list`, { photographer_id, date })
      .then(response => {
        setEvents(response.data);
        setHoraryDisable(false);

        enqueueSnackbar("Horários definidos!", {
          variant: "success",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      })
      .catch(error => {
        enqueueSnackbar("Problemas ao definir os horários!", {
          variant: "error",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      });
  }

  async function handleSubmitStep0() {
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
          .post(`/district/byName`, {
            district,
            city_id: response.data[0].id
          })
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

                enqueueSnackbar(
                  "Informe a data da sessão para carregar os horários livres!",
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

  async function handleSubmitStep1() {
    if (!date) {
      enqueueSnackbar("Necessário informar data da sessão para prosseguir", {
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
      enqueueSnackbar("Necessário informar horário da sessão para prosseguir", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    setStep(2);
  }

  async function handleSubmitStep2() {
    if (
      !date ||
      !latitude ||
      !longitude ||
      !address ||
      !complement ||
      !region_id ||
      !city_id ||
      !district_id ||
      !photographer_id ||
      !horary_id ||
      !client_id
    ) {
      enqueueSnackbar(
        "Informações estão faltando para dar sequência ao processo!",
        {
          variant: "error",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        }
      );
      return;
    }

    await api
      .post(`/scheduling`, {
        date,
        latitude,
        longitude,
        address,
        complement,
        accompanies,
        drone,
        region_id,
        city_id,
        district_id,
        photographer_id,
        horary_id,
        client_id
      })
      .then(async response => {
        const scheduling_id = response.data.id,
          numTime = Date.parse(`1970-01-01T${horary}Z`),
          numDate = Date.parse(`${date}T00:00:00Z`),
          dateTimeStart = new Date(numDate + numTime),
          dateTimeEnd = new Date(numDate + numTime + 4500000);

        await api
          .post(`/google/event/insertEvent`, {
            scheduling_id,
            dateTimeEnd,
            dateTimeStart
          })
          .then(() => {
            enqueueSnackbar("Registro cadastrado com sucesso!", {
              variant: "success",
              autoHideDuration: 2500,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center"
              }
            });

            history.push(`/sessions`);
          });
      })
      .catch(error => {
        enqueueSnackbar("Erro ao cadastrar registro!", {
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
      <Paper className={classes.paper}>
        <Typography component="h2" variant="h4">
          Onde será a sessão de fotos
        </Typography>

        <div className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Maps addressInfo={getAddress} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                onChange={event => {
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
                size="small"
                className={classes.submit}
                onClick={() => {
                  handleSubmitStep0();
                }}
              >
                Continuar
              </Button>
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }

  if (step === 1) {
    return (
      <Paper className={classes.paper}>
        <Typography component="h2" variant="h4">
          Quando será a sessão de fotos
        </Typography>

        <div className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="date"
                onChange={event => {
                  verifyDate(event.target.value);
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
                <InputLabel ref={inputLabel} id="horarySelect">
                  Horários
                </InputLabel>
                <Select
                  id="horarySelect"
                  labelWidth={labelWidth}
                  value={horary_id}
                  disabled={horaryDisable}
                  onChange={event => {
                    setHoraryId(event.target.value);
                    setHorary(event.nativeEvent.srcElement.innerText);
                  }}
                >
                  <MenuItem value="">-- Selecione --</MenuItem>
                  {horaries.map(item => {
                    const date_horary = `${date} ${item.time}`;
                    let validHorary = true;

                    if (!date_horary) {
                      return;
                    }

                    events.map(event => {
                      const eventStart = event.start.date
                        ? `${event.start.date} 00:00:00`
                        : event.start.dateTime;
                      const eventEnd = event.end.date
                        ? `${event.end.date} 23:59:59`
                        : event.end.dateTime;

                      if (
                        (Date.parse(date_horary) + 1 >=
                          Date.parse(eventStart) &&
                          Date.parse(date_horary) + 1 <=
                            Date.parse(eventEnd)) ||
                        (Date.parse(date_horary) + 4499999 >=
                          Date.parse(eventStart) &&
                          Date.parse(date_horary) + 4499999 <=
                            Date.parse(eventEnd))
                      ) {
                        validHorary = false;
                      }
                    });

                    if (validHorary) {
                      return (
                        <MenuItem id={item.time} key={item.id} value={item.id}>
                          {item.time}
                        </MenuItem>
                      );
                    }
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
                variant="contained"
                color="secondary"
                size="small"
                fullWidth
                className={classes.submit}
                onClick={() => {
                  handleReturnStep();
                }}
              >
                Voltar
              </Button>
            </Grid>
            <Grid item xs={8}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                fullWidth
                className={classes.submit}
                onClick={() => {
                  handleSubmitStep1();
                }}
              >
                Continuar
              </Button>
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }

  if (step === 2) {
    return (
      <Paper className={classes.paper}>
        <Typography component="h2" variant="h4">
          Confirme as informações do agendamento
        </Typography>

        <div className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="text"
                value={address}
                label="Endereço"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                value={complement}
                label="Complemento"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                value={formatDate}
                label="Data da Sessão"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                value={horary}
                label="Horário da Sessão"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormGroup row>
                <FormControlLabel
                  label="Cliente estará presente na sessão"
                  control={
                    <Checkbox
                      checked={accompanies}
                      value={accompanies}
                      InputProps={{
                        readOnly: true
                      }}
                    />
                  }
                />
              </FormGroup>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                fullWidth
                className={classes.submit}
                onClick={() => {
                  handleReturnStep();
                }}
              >
                Voltar
              </Button>
            </Grid>
            <Grid item xs={8}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                fullWidth
                className={classes.submit}
                onClick={() => {
                  handleSubmitStep2();
                }}
              >
                Agendar
              </Button>
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  clientCode: state.clientCode
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(Scheduling);
