import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import { useParams } from "react-router-dom";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

import { makeStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";

import api from "../../../services/api";

import history from "../../../history";

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
  }
}));

function Rescheduling({ enqueueSnackbar, clientCode }) {
  const classes = useStyles(),
    [horaries, setHoraries] = useState([]),
    [photographers, setPhotographers] = useState([]),
    [horary, setHorary] = useState(""),
    [horary_id, setHoraryId] = useState(""),
    [horaryDisable, setHoraryDisable] = useState(true),
    [insertEvent, setInsertEvent] = useState(false),
    [events, setEvents] = useState([]),
    [date, setDate] = useState(null),
    [photographer_id, setPhotographerId] = useState(""),
    [photographer, setPhotographer] = useState([]),
    [photographer_sabado, setPhotographerSabado] = useState([]),
    [scheduling_id, setSchedulingId] = useState(""),
    [scheduling, setScheduling] = useState([]),
    [labelWidth, setLabelWidth] = useState(0),
    inputLabel = React.useRef(null),
    { id } = useParams();

  useEffect(() => {
    if (horaries.length === 0) {
      setSchedulingId(id);
      getScheduling();
      getHoraries();
      getPhotographerSabado();
      setLabelWidth(inputLabel.current.offsetWidth);
    }
  }, [horaries, id]);

  async function getHoraries() {
    await api.get("/horary/active").then(response => {
      setHoraries(response.data);
    });
  }

  async function getPhotographers() {
    await api.get("/photographer/active").then(response => {
      setPhotographers(response.data);
    });
  }

  async function getPhotographerSabado() {
    await api.get("/photographer/sabado").then(response => {
      setPhotographerSabado(response.data[0]);
    });
  }

  async function getScheduling() {
    await api.get(`/scheduling/${id}`).then(response => {
      if (
        response.data[0].completed ||
        (!response.data[0].actived && response.data[0].date)
      ) {
        history.push(`/scheduling`);
      }
      setPhotographerId(response.data[0].photographer_id);
      setScheduling(response.data[0]);
      setPhotographer(response.data[0].photographer);

      if (!response.data[0].date) {
        getPhotographers();
      }
    });
  }

  function verifyDate(value) {
    setDate(value);
    setHoraryDisable(true);
    setHoraryId();

    if (!insertEvent) {
      if (Date.parse(value)) {
        getCalendarEvents(value);

        enqueueSnackbar("Carregando horários disponíveis na data selecionada", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      }
    } else {
      setHoraryDisable(false);
    }
  }

  async function getCalendarEvents(date) {
    await api
      .post(`/calendar/event/list`, {
        photographer_id:
          new Date(new Date(+new Date(date) + 86400000)).getDay() == 6
            ? photographer_sabado.id
            : photographer.id,
        date
      })
      .then(response => {
        setEvents(response.data);
        setHoraryDisable(false);

        enqueueSnackbar("Horários definidos!", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      })
      .catch(error => {
        enqueueSnackbar("Problemas ao definir os horários!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      });
  }

  async function handleCancel() {
    if (!scheduling_id) {
      enqueueSnackbar(
        "Informações estão faltando para dar sequência ao processo!",
        {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        }
      );
      return;
    }

    await api
      .put(`/scheduling/${scheduling_id}`, {
        changed: true,
        actived: false,
        date_cancel: clientCode
          ? `${new Date().toISOString().split("T")[0]} ${
              new Date().toTimeString().split(" ")[0]
            }`
          : null
      })
      .then(async response => {
        await api
          .post(`/google/event/cancelEvent`, {
            scheduling_id
          })
          .then(response => {
            enqueueSnackbar("Sessão cancelada com sucesso!", {
              variant: "success",
              autoHideDuration: 5000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center"
              }
            });
            history.push(`/scheduling`);
          });
      })
      .catch(error => {
        enqueueSnackbar("Problemas ao cancelar sessão!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      });
  }

  async function handleScheduling() {
    if (!photographer_id) {
      enqueueSnackbar("Necessário informar fotógrafo para prosseguir", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!date) {
      enqueueSnackbar("Necessário informar data da sessão para prosseguir", {
        variant: "error",
        autoHideDuration: 5000,
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
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!photographer_id || !date || !horary_id || !scheduling_id) {
      enqueueSnackbar(
        "Informações estão faltando para dar sequência ao processo!",
        {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        }
      );
      return;
    }
    await api
      .put(`/scheduling/${scheduling_id}`, {
        date,
        horary_id,
        photographer_id,
        changed: false,
        actived: true
      })
      .then(async response => {
        if (!insertEvent) {
          const scheduling_id = response.data.id;
          await api
            .post(`/google/event/insertEvent`, {
              scheduling_id,
              horary,
              date
            })
            .then(response => {
              enqueueSnackbar("Sessão agendada com sucesso!", {
                variant: "success",
                autoHideDuration: 5000,
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "center"
                }
              });

              history.push(`/scheduling`);
            });
        } else {
          enqueueSnackbar("Registro cadastrado com sucesso!", {
            variant: "success",
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center"
            }
          });

          history.push(`/scheduling`);
        }
      })
      .catch(error => {
        enqueueSnackbar("Erro ao agendar sessão!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      });
  }

  async function handleRescheduling() {
    if (!date) {
      enqueueSnackbar("Necessário informar data da sessão para prosseguir", {
        variant: "error",
        autoHideDuration: 5000,
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
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!date || !horary_id || !scheduling_id) {
      enqueueSnackbar(
        "Informações estão faltando para dar sequência ao processo!",
        {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        }
      );
      return;
    }
    await api
      .put(`/scheduling/${scheduling_id}`, {
        date,
        photographer_id,
        horary_id,
        changed: true
      })
      .then(async response => {
        const scheduling_id = response.data.id;
        await api
          .post(`/google/event/editEvent`, {
            scheduling_id,
            horary,
            date
          })
          .then(response => {
            enqueueSnackbar("Sessão reagendada com sucesso!", {
              variant: "success",
              autoHideDuration: 5000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center"
              }
            });

            history.push(`/scheduling`);
          });
      })
      .catch(error => {
        enqueueSnackbar("Problemas ao reagendar sessão!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      });
  }

  return (
    <>
      {!scheduling.date && (
        <Paper className={classes.paper}>
          <Typography component="h2" variant="h4">
            Agendar sessão
          </Typography>

          <div className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel ref={inputLabel} id="photographerSelect">
                    Fotógrafo
                  </InputLabel>
                  <Select
                    id="photographerSelect"
                    labelWidth={labelWidth}
                    value={photographer_id}
                    onChange={event => {
                      setPhotographerId(event.target.value);
                    }}
                  >
                    <MenuItem value="">-- Selecione --</MenuItem>
                    {photographers.map(item => {
                      return (
                        <MenuItem id={item.id} key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormGroup row>
                  <FormControlLabel
                    label="Agendamento sem integração com agenda?"
                    control={
                      <Checkbox
                        checked={insertEvent}
                        onChange={event => {
                          setInsertEvent(!insertEvent);
                          setEvents([]);
                          setDate();
                          setHoraryDisable(true);
                          setHoraryId();
                        }}
                        value={insertEvent}
                      />
                    }
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    autoOk
                    value={date ? new Date(+new Date(date) + 86400000) : date}
                    inputVariant="outlined"
                    fullWidth
                    label="Data da Sessão"
                    disabled={!photographer_id}
                    onChange={date => {
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
                                horizontal: "center"
                              }
                            }
                          );
                        } else {
                          if (date.getDay() == 6) {
                            setPhotographerId(photographer_sabado.id);
                          } else {
                            setPhotographerId(photographer.id);
                          }
                          verifyDate(`${year}-${month}-${day}`);
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
                    onChange={event => {
                      setHoraryId(event.target.value);
                      setHorary(event.nativeEvent.target.id);
                    }}
                  >
                    <MenuItem value="">-- Selecione --</MenuItem>
                    {horaries.map(item => {
                      const date_horary = new Date(
                        `${date}T${item.time}-03:00`
                      );
                      let validHorary = true;

                      if (!date_horary) {
                        return;
                      }

                      if (new Date(date_horary).getDay() == 6 && !item.sabado) {
                        validHorary = false;
                      }

                      events.map(event => {
                        if (event.status == "confirmed") {
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
                        }
                      });

                      if (validHorary) {
                        return (
                          <MenuItem
                            id={item.time}
                            key={item.id}
                            value={item.id}
                          >
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
                  type="submit"
                  variant="contained"
                  size="small"
                  fullWidth
                  className={classes.submit}
                  onClick={() => {
                    history.push(`/scheduling`);
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
                    handleScheduling();
                  }}
                >
                  Agendar sessão
                </Button>
              </Grid>
            </Grid>
          </div>
        </Paper>
      )}

      {scheduling.date && (
        <Paper className={classes.paper}>
          <Typography component="h2" variant="h4">
            Cancele ou reagende sua sessão
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
                    label="Data da Sessão (Apenas para reagendar)"
                    disabled={!photographer_id}
                    onChange={date => {
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
                                horizontal: "center"
                              }
                            }
                          );
                        } else {
                          if (date.getDay() == 6) {
                            setPhotographerId(photographer_sabado.id);
                          } else {
                            setPhotographerId(photographer.id);
                          }
                          verifyDate(`${year}-${month}-${day}`);
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
                    onChange={event => {
                      setHoraryId(event.target.value);
                      setHorary(event.nativeEvent.target.id);
                    }}
                  >
                    <MenuItem value="">-- Selecione --</MenuItem>
                    {horaries.map(item => {
                      const date_horary = new Date(
                        `${date}T${item.time}-03:00`
                      );
                      let validHorary = true;

                      if (!date_horary) {
                        return;
                      }

                      if (
                        new Date(date_horary).getDay() == 6 &&
                        item.sabado &&
                        clientCode
                      ) {
                        validHorary = false;
                      }

                      events.map(event => {
                        if (event.status == "confirmed") {
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
                        }
                      });

                      if (validHorary) {
                        return (
                          <MenuItem
                            id={item.time}
                            key={item.id}
                            value={item.id}
                          >
                            {item.time}
                          </MenuItem>
                        );
                      }
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="small"
                  fullWidth
                  className={classes.submit}
                  onClick={() => {
                    handleCancel();
                  }}
                >
                  Cancelar sessão
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="small"
                  fullWidth
                  className={classes.submit}
                  onClick={() => {
                    handleRescheduling();
                  }}
                >
                  Reagendar sessão
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  fullWidth
                  className={classes.submit}
                  onClick={() => {
                    history.push(`/scheduling`);
                  }}
                >
                  Voltar
                </Button>
              </Grid>
            </Grid>
          </div>
        </Paper>
      )}
    </>
  );
}

const mapStateToProps = state => ({
  clientCode: state.clientCode
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(Rescheduling);
