import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";

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
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function Rescheduling({ enqueueSnackbar }) {
  const classes = useStyles(),
    [horaries, setHoraries] = useState([]),
    [horary, setHorary] = useState(""),
    [horary_id, setHoraryId] = useState(""),
    [horaryDisable, setHoraryDisable] = useState(true),
    [events, setEvents] = useState([]),
    [date, setDate] = useState(),
    [photographer_id, setPhotographerId] = useState(""),
    [scheduling_id, setSchedulingId] = useState(""),
    [labelWidth, setLabelWidth] = useState(0),
    inputLabel = React.useRef(null),
    { id } = useParams();

  useEffect(() => {
    if (horaries.length === 0) {
      setSchedulingId(id);
      getScheduling();
      getHoraries();
      setLabelWidth(inputLabel.current.offsetWidth);
    }
  }, [horaries, id]);

  async function getHoraries() {
    await api.get("/horary/active").then(response => {
      setHoraries(response.data);
    });
  }

  async function getScheduling() {
    await api.get(`/scheduling/${id}`).then(response => {
      setPhotographerId(response.data[0].photographer_id);
    });
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
    }
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

  async function handleSubmit() {
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

    if (!date || !horary_id || !scheduling_id) {
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
      .put(`/scheduling/${scheduling_id}`, {
        date,
        horary_id
      })
      .then(async response => {
        const numTime = Date.parse(`1970-01-01T${horary}Z`),
          numDate = Date.parse(`${date}T00:00:00Z`),
          dateTimeStart = new Date(numDate + numTime),
          dateTimeEnd = new Date(numDate + numTime + 4500000);

        await api
          .post(`/google/event/editEvent`, {
            scheduling_id,
            dateTimeEnd,
            dateTimeStart
          })
          .then(response => {
            enqueueSnackbar("Sessão reagendada com sucesso!", {
              variant: "success",
              autoHideDuration: 2500,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center"
              }
            });
          });
      })
      .catch(error => {
        enqueueSnackbar("Problemas ao reagendar sessão!", {
          variant: "error",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      });
  }

  return (
    <Paper className={classes.paper}>
      <Typography component="h2" variant="h4">
        Reagende a sessão de fotos
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
                      (Date.parse(date_horary) + 1 >= Date.parse(eventStart) &&
                        Date.parse(date_horary) + 1 <= Date.parse(eventEnd)) ||
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
          <Grid item xs={4}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="small"
              fullWidth
              className={classes.submit}
              onClick={() => {
                history.push(`/admin/scheduling`);
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
                handleSubmit();
              }}
            >
              Reagendar
            </Button>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
}

export default withSnackbar(Rescheduling);
