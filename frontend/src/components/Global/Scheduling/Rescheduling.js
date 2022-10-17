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
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { makeStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";

import moment from "moment";

import api from "../../../services/api";

import history from "../../../history";

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
    [date, setDate] = useState(new Date()),
    [photographer_id, setPhotographerId] = useState(""),
    [photographer, setPhotographer] = useState([]),
    [reason, setReason] = useState(null),
    [scheduling_id, setSchedulingId] = useState(""),
    [scheduling, setScheduling] = useState([]),
    [labelWidth, setLabelWidth] = useState(0),
    inputLabel = React.useRef(null),
    { id } = useParams();

  useEffect(() => {
    setSchedulingId(id);
    getScheduling();
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  async function getHoraries(date, dia_semana, photographer_id) {
    setHoraryDisable(true);
    setHoraryId();

    enqueueSnackbar("Carregando horários disponíveis na data selecionada", {
      variant: "success",
      autoHideDuration: 5000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
    });

    await api
      .get("/horary", { params: { photographer_id, dia_semana } })
      .then(async (response) => {
        if (response.data && response.data.length > 0) {
          setHoraries(response.data);
          getEvents(date.format("YYYY-MM-DD"), photographer_id);
        }
      });
  }

  async function getPhotographers() {
    await api.get("/photographer/active").then((response) => {
      setPhotographers(response.data);
    });
  }

  async function getScheduling() {
    await api.get(`/scheduling/${id}`).then((response) => {
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

  async function getEvents(date, photographerId) {
    await api
      .post(`/calendar/event/list`, {
        photographer_id: photographerId,
        date,
      })
      .then((response) => {
        if (response.data) {
          setEvents(response.data);
          setHoraryDisable(false);
        } else {
          setEvents([]);
          setHoraryDisable(false);
        }

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

  async function handleCancel() {
    if (!scheduling_id) {
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

    if (clientCode && !reason) {
      enqueueSnackbar("Necessário informar um motivo para cancelar a sessão!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    await api
      .put(`/scheduling/${scheduling_id}`, {
        changed: true,
        actived: false,
        date_cancel: clientCode ? moment().format("YYYY-MM-DD") : null,
        reason: clientCode ? reason : null,
      })
      .then(async (response) => {
        await api
          .post(`/google/event/cancelEvent`, {
            scheduling_id,
          })
          .then((response) => {
            enqueueSnackbar("Sessão cancelada com sucesso!", {
              variant: "success",
              autoHideDuration: 5000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center",
              },
            });
            history.push(`/scheduling`);
          });
      })
      .catch((error) => {
        enqueueSnackbar("Problemas ao cancelar sessão!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
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
          horizontal: "center",
        },
      });
      return;
    }

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

    if (!photographer_id || !date || !horary_id || !scheduling_id) {
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
      .put(`/scheduling/${scheduling_id}`, {
        date: date.format("YYYY-MM-DD"),
        horary,
        photographer_id,
        changed: false,
        actived: true,
      })
      .then(async (response) => {
        if (!insertEvent) {
          const scheduling_id = response.data.id;
          await api
            .post(`/google/event/insertEvent`, {
              scheduling_id,
              horary,
              date: date.format("YYYY-MM-DD"),
            })
            .then(() => {
              enqueueSnackbar("Sessão agendada com sucesso!", {
                variant: "success",
                autoHideDuration: 5000,
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "center",
                },
              });
            });
        } else {
          const scheduling_id = response.data.id;
          await api
            .post(`/scheduling/event/sendEmail`, {
              scheduling_id,
              horary,
            })
            .then((response) => {
              enqueueSnackbar("Sessão agendada com sucesso!", {
                variant: "success",
                autoHideDuration: 5000,
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "center",
                },
              });
            });
        }

        history.push(`/scheduling`);
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao agendar sessão!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
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

    if (clientCode && !reason) {
      enqueueSnackbar(
        "Necessário informar um motivo para reagendar a sessão!",
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

    if (!date || !horary_id || !scheduling_id) {
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
      .put(`/scheduling/${scheduling_id}`, {
        date: date.format("YYYY-MM-DD"),
        photographer_id,
        horary,
        changed: true,
        reason: clientCode ? reason : null,
      })
      .then(async (response) => {
        const scheduling_id = response.data.id;
        await api
          .post(`/google/event/editEvent`, {
            scheduling_id,
            old_photographer_id: photographer_id,
            horary,
            date: date.format("YYYY-MM-DD"),
          })
          .then((response) => {
            enqueueSnackbar("Sessão reagendada com sucesso!", {
              variant: "success",
              autoHideDuration: 5000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center",
              },
            });

            history.push(`/scheduling`);
          });
      })
      .catch((error) => {
        enqueueSnackbar("Problemas ao reagendar sessão!", {
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
                    onChange={(event) => {
                      setPhotographerId(event.target.value);
                    }}
                  >
                    <MenuItem value="">-- Selecione --</MenuItem>
                    {photographers.map((item) => {
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
                    label="Agendamento sem integração com agenda"
                    control={
                      <Checkbox
                        checked={insertEvent}
                        onChange={(event) => {
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
                    value={date ? moment(date) : ""}
                    inputVariant="outlined"
                    fullWidth
                    label="Data da Sessão"
                    onChange={(value) => {
                      let date = moment(value);

                      if (value && date.isValid()) {
                        if (date.day() === 0) {
                          enqueueSnackbar(
                            "A data informada é um domingo! Por favor, selecione outra data.",
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
                          setDate(date);
                          getHoraries(date, date.day(), photographer_id);
                        }
                      }
                    }}
                    minDate={moment()}
                    format="dd/MM/yyyy"
                    cancelLabel="Cancelar"
                    invalidDateMessage="Data em formato inválido."
                    minDateMessage={`A data deve ser maior que ${moment().format(
                      "DD/MM/YYYY"
                    )}.`}
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
                      let validHorary = true;

                      const dateHorary = moment(
                          moment(date).format("YYYY-MM-DD") + " " + item.time
                        ),
                        initDay = moment(date).set({
                          hour: 0,
                          minute: 0,
                          second: 0,
                          millisecond: 0,
                        }),
                        endDay = moment(date).set({
                          hour: 23,
                          minute: 59,
                          second: 59,
                          millisecond: 59,
                        });

                      events.map((event) => {
                        if (event.status === "confirmed") {
                          const dateStart = moment(event.start.dateTime);
                          const dateEnd = moment(event.end.dateTime);

                          const eventStart = event.start.date
                            ? initDay
                            : moment(
                                moment(date).format("YYYY-MM-DD") +
                                  " " +
                                  moment(dateStart).format("HH:mm:ss")
                              );

                          const eventEnd = event.end.date
                            ? endDay
                            : moment(
                                moment(date).format("YYYY-MM-DD") +
                                  " " +
                                  moment(dateEnd).format("HH:mm:ss")
                              );

                          if (
                            (eventStart.isBefore(
                              dateHorary.clone().add(1, "seconds")
                            ) &&
                              eventEnd.isAfter(
                                dateHorary.clone().add(1, "seconds")
                              )) ||
                            (eventStart.isBefore(
                              dateHorary
                                .clone()
                                .add(photographer.intervalo, "minutes")
                                .subtract(1, "seconds")
                            ) &&
                              eventEnd.isAfter(
                                dateHorary
                                  .clone()
                                  .add(photographer.intervalo, "minutes")
                                  .subtract(1, "seconds")
                              ))
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
                    value={date ? moment(date) : ""}
                    inputVariant="outlined"
                    fullWidth
                    label="Data da Sessão"
                    onChange={(value) => {
                      let date = moment(value);

                      if (value && date.isValid()) {
                        if (date.day() === 0) {
                          enqueueSnackbar(
                            "A data informada é um domingo! Por favor, selecione outra data.",
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
                          setDate(date);
                          getHoraries(date, date.day(), photographer_id);
                        }
                      }
                    }}
                    minDate={moment()}
                    format="dd/MM/yyyy"
                    cancelLabel="Cancelar"
                    invalidDateMessage="Data em formato inválido."
                    minDateMessage={`A data deve ser maior que ${moment().format(
                      "DD/MM/YYYY"
                    )}.`}
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
                      let validHorary = true;

                      const dateHorary = moment(
                          moment(date).format("YYYY-MM-DD") + " " + item.time
                        ),
                        initDay = moment(date).set({
                          hour: 0,
                          minute: 0,
                          second: 0,
                          millisecond: 0,
                        }),
                        endDay = moment(date).set({
                          hour: 23,
                          minute: 59,
                          second: 59,
                          millisecond: 59,
                        });

                      events.map((event) => {
                        if (event.status === "confirmed") {
                          const dateStart = moment(event.start.dateTime);
                          const dateEnd = moment(event.end.dateTime);

                          const eventStart = event.start.date
                            ? initDay
                            : moment(
                                moment(date).format("YYYY-MM-DD") +
                                  " " +
                                  moment(dateStart).format("HH:mm:ss")
                              );

                          const eventEnd = event.end.date
                            ? endDay
                            : moment(
                                moment(date).format("YYYY-MM-DD") +
                                  " " +
                                  moment(dateEnd).format("HH:mm:ss")
                              );

                          if (
                            (eventStart.isBefore(
                              dateHorary.clone().add(1, "seconds")
                            ) &&
                              eventEnd.isAfter(
                                dateHorary.clone().add(1, "seconds")
                              )) ||
                            (eventStart.isBefore(
                              dateHorary
                                .clone()
                                .add(photographer.intervalo, "minutes")
                                .subtract(1, "seconds")
                            ) &&
                              eventEnd.isAfter(
                                dateHorary
                                  .clone()
                                  .add(photographer.intervalo, "minutes")
                                  .subtract(1, "seconds")
                              ))
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
              <Grid item xs={12}>
                <TextField
                  type="text"
                  onChange={(event) => {
                    setReason(event.target.value);
                  }}
                  value={reason}
                  label="Motivo"
                  variant="outlined"
                  fullWidth
                />
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

const mapStateToProps = (state) => ({
  clientCode: state.clientCode,
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(Rescheduling);
