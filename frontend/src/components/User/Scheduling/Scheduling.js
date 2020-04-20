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
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { makeStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";

import api from "../../../services/api";

import history from "../../../history";

import Maps from "../../Global/Scheduling/Maps";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Scheduling({ enqueueSnackbar, clientCode }) {
  const classes = useStyles(),
    [step, setStep] = useState(0),
    [horaries, setHoraries] = useState([]),
    [horary, setHorary] = useState(""),
    [parcial, setParcial] = useState(false),
    [city, setCity] = useState(""),
    [district, setDistrict] = useState(""),
    [formatDate, setFormatDate] = useState(),
    [horaryDisable, setHoraryDisable] = useState(true),
    [events, setEvents] = useState([]),
    [date, setDate] = useState(new Date()),
    [latitude, setLat] = useState(""),
    [longitude, setLng] = useState(""),
    [address, setAddress] = useState(""),
    [complement, setComplement] = useState(""),
    [comments, setComments] = useState(""),
    [accompanies, setAccompanies] = useState(false),
    [drone, setDrone] = useState(false),
    [tour360, setTour360] = useState(false),
    [region_id, setRegionId] = useState(""),
    [city_id, setCityId] = useState(""),
    [district_id, setDistrictId] = useState(""),
    [photographer, setPhotographer] = useState([]),
    [photographer_sabado, setPhotographerSabado] = useState([]),
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
    getPhotographerSabado();
  }, [enqueueSnackbar, step]);

  async function getHoraries() {
    await api.get("/horary/active").then((response) => {
      setHoraries(response.data);
    });
  }

  async function getPhotographerSabado() {
    await api.get("/photographer/sabado").then((response) => {
      setPhotographerSabado(response.data[0]);
    });
  }

  async function getAddress(address, lat, lng, city, district) {
    setAddress(address);
    setCity(city);
    setDistrict(district);
    setLat(lat);
    setLng(lng);
    await api.post(`/city/byName`, { city }).then(async (response) => {
      setCityId(response.data[0].id);
      await api
        .post(`/district/byName`, {
          district,
          city_id: response.data[0].id,
        })
        .then(async (response) => {
          setDistrictId(response.data[0].id);
          setRegionId(response.data[0].region_id);
          await api
            .post(`/photographer/byRegion`, {
              region_id: response.data[0].region_id,
            })
            .then(async (response) => {
              setPhotographer(response.data[0]);
              setPhotographerId(response.data[0].id);
            });
        })
        .catch((error) => {
          enqueueSnackbar(
            "Problemas com endereço informado! Entre em contato pelo email sheeephouse@gmail.com relatando o acontecimento.",
            {
              variant: "error",
              autoHideDuration: 5000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center",
              },
            }
          );
        });
    });
  }

  function verifyDate(value, photographerId) {
    setDate(value);
    setHoraryDisable(true);
    setHoraryId();

    if (Date.parse(value) > Date.now() - 129600000) {
      getCalendarEvents(value, photographerId);

      enqueueSnackbar("Carregando horários disponíveis na data selecionada", {
        variant: "success",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });

      setFormatDate(
        value.slice(8, 10) + "/" + value.slice(5, 7) + "/" + value.slice(0, 4)
      );
    }
  }

  function handleReturnStep() {
    setStep(step - 1);
  }

  async function getCalendarEvents(date, photographerId) {
    await api
      .post(`/calendar/event/list`, {
        photographer_id: photographerId,
        date,
      })
      .then((response) => {
        setEvents(response.data);
        setHoraryDisable(false);

        enqueueSnackbar("Horários definidos!", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      })
      .catch((error) => {
        enqueueSnackbar("Problemas ao definir os horários!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      });
  }

  async function handleSubmitStep0() {
    if (!address) {
      enqueueSnackbar("Necessário informar endereço para prosseguir", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (parcial || drone) {
      await api
        .post(`/scheduling`, {
          latitude,
          longitude,
          address,
          complement,
          comments,
          drone,
          region_id,
          city_id,
          district_id,
          photographer_id,
          client_id,
          accompanies,
          actived: false,
        })
        .then(async (response) => {
          enqueueSnackbar("Sessão cadastrada com sucesso!", {
            variant: "success",
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
          });

          history.push(`/scheduling`);
        })
        .catch((error) => {
          enqueueSnackbar("Erro ao cadastrar sessão!", {
            variant: "error",
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
          });
        });
    } else {
      enqueueSnackbar("Fotográfo foi selecionado pelo endereço informado!", {
        variant: "success",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });

      enqueueSnackbar(
        "Informe a data da sessão para carregar os horários livres!",
        {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        }
      );

      setStep(1);
    }
  }

  async function handleSubmitStep1() {
    if (!date) {
      enqueueSnackbar("Necessário informar data da sessão para prosseguir", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!horary_id) {
      enqueueSnackbar("Necessário informar horário da sessão para prosseguir", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
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
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
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
        comments,
        accompanies,
        drone,
        tour360,
        region_id,
        city_id,
        district_id,
        photographer_id,
        horary_id,
        client_id,
      })
      .then(async (response) => {
        const scheduling_id = response.data.id;
        await api
          .post(`/google/event/insertEvent`, {
            scheduling_id,
            horary,
            date,
          })
          .then(() => {
            enqueueSnackbar(
              "Agendamento concluído com sucesso.\n\nA Sheep House agradece a preferência!",
              {
                variant: "success",
                autoHideDuration: 5000,
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "center",
                },
              }
            );

            history.push(`/scheduling`);
          });
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao cadastrar registro!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      });
  }

  if (step === 0) {
    return (
      <Paper className={classes.paper}>
        <Typography component="h2" variant="h4">
          Insira os dados da sua sessão
        </Typography>

        <div className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Maps addressInfo={getAddress} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="text"
                onChange={(event) => {
                  setComplement(event.target.value);
                }}
                value={complement}
                label="Complemento"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(event) => {
                  setComments(event.target.value);
                }}
                value={comments}
                label="Observações"
                variant="outlined"
                rows="3"
                fullWidth
                multiline
              />
            </Grid>
            <Grid item xs={12}>
              <FormGroup row>
                <FormControlLabel
                  label="Tour Virtual 360°"
                  control={
                    <Checkbox
                      checked={tour360}
                      onChange={(event) => {
                        setTour360(!tour360);
                      }}
                      value={tour360}
                    />
                  }
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormGroup row>
                <FormControlLabel
                  label="Retirar chaves na imobiliária"
                  control={
                    <Checkbox
                      checked={parcial}
                      onChange={(event) => {
                        setParcial(!parcial);
                      }}
                      value={parcial}
                    />
                  }
                />
              </FormGroup>
              <small style={{ float: "left", fontStyle: "italic" }}>
                Para IMÓVEIS desocupados a Sheep House fornece serviço de
                retirada de chaves.
              </small>
              <br />
            </Grid>
            <Grid item xs={12}>
              <FormGroup row>
                <FormControlLabel
                  label="Filmagem e/ou uso de Drone"
                  control={
                    <Checkbox
                      checked={drone}
                      onChange={(event) => {
                        setDrone(!drone);
                      }}
                      value={drone}
                    />
                  }
                />
              </FormGroup>
              <small style={{ float: "left", fontStyle: "italic" }}>
                Para serviços de filmagem interna ou serviços com drone
              </small>
              {(drone || parcial) && (
                <>
                  <br />
                  <br />
                  <small
                    style={{
                      float: "left",
                      fontWeight: "bold",
                    }}
                  >
                    O agendamento será confirmado pelo administrador
                    posteriormente, selecionando um horário adequeado para a
                    sessão
                  </small>
                </>
              )}
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
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  autoOk
                  value={date ? new Date(+new Date(date) + 86400000) : date}
                  inputVariant="outlined"
                  fullWidth
                  label="Data da Sessão"
                  disabled={!photographer_id}
                  onChange={(date) => {
                    if (date) {
                      const year = date.getFullYear(),
                        month = ("0" + (date.getMonth() + 1)).slice(-2),
                        day = ("0" + date.getDate()).slice(-2);

                      if (date.getDay() == 0) {
                        enqueueSnackbar(
                          "A data informada é domingo! Por favor, selecione outra data.",
                          {
                            variant: "error",
                            autoHideDuration: 5000,
                            anchorOrigin: {
                              vertical: "top",
                              horizontal: "center",
                            },
                          }
                        );
                      } else {
                        if (date.getDay() == 6) {
                          setPhotographerId(photographer_sabado.id);
                          verifyDate(
                            `${year}-${month}-${day}`,
                            photographer_sabado.id
                          );
                        } else {
                          setPhotographerId(photographer.id);
                          verifyDate(
                            `${year}-${month}-${day}`,
                            photographer.id
                          );
                        }
                      }
                    }
                  }}
                  minDate={new Date()}
                  format="dd/MM/yyyy"
                />
              </MuiPickersUtilsProvider>
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
                  onChange={(event) => {
                    setHoraryId(event.target.value);
                    setHorary(event.nativeEvent.target.id);
                  }}
                >
                  <MenuItem value="">-- Selecione --</MenuItem>
                  {horaries.map((item) => {
                    const date_horary = new Date(`${date}T${item.time}-03:00`);

                    let validHorary = true;

                    if (!date_horary) {
                      return;
                    }

                    if (new Date(date_horary).getDay() == 6 && !item.sabado) {
                      validHorary = false;
                    }

                    events.map((event) => {
                      if (event.status == "confirmed") {
                        const eventStart = event.start.date
                          ? `${date} 00:00:00`
                          : `${date} ${new Date(
                              event.start.dateTime
                            ).toLocaleTimeString()}`;
                        const eventEnd = event.end.date
                          ? `${date} 23:59:59`
                          : `${date} ${new Date(
                              event.end.dateTime
                            ).toLocaleTimeString()}`;

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
                  readOnly: true,
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
                  readOnly: true,
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
                  readOnly: true,
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
                  readOnly: true,
                }}
              />
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

const mapStateToProps = (state) => ({
  clientCode: state.clientCode,
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(Scheduling);
