import "date-fns";
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

function Scheduling({ enqueueSnackbar }) {
  const classes = useStyles(),
    [horaries, setHoraries] = useState([]),
    [photographers, setPhotographers] = useState([]),
    [clients, setClients] = useState([]),
    [horary, setHorary] = useState(""),
    [city, setCity] = useState(""),
    [district, setDistrict] = useState(""),
    [formatDate, setFormatDate] = useState(),
    [horaryDisable, setHoraryDisable] = useState(true),
    [dateDisable, setDateDisable] = useState(true),
    [events, setEvents] = useState([]),
    [date, setDate] = useState(new Date()),
    [latitude, setLat] = useState(""),
    [longitude, setLng] = useState(""),
    [address, setAddress] = useState(""),
    [complement, setComplement] = useState(""),
    [comments, setComments] = useState(""),
    [accompanies, setAccompanies] = useState(false),
    [insertEvent, setInsertEvent] = useState(false),
    [drone, setDrone] = useState(false),
    [tour360, setTour360] = useState(false),
    [region_id, setRegionId] = useState(""),
    [city_id, setCityId] = useState(""),
    [district_id, setDistrictId] = useState(""),
    [photographer_id, setPhotographerId] = useState(""),
    [horary_id, setHoraryId] = useState(""),
    [client_id, setClientId] = useState(""),
    [labelWidth, setLabelWidth] = useState(0),
    inputLabel = React.useRef(null),
    script = document.createElement("script");

  script.src = "https://apis.google.com/js/client.js";

  useEffect(() => {
    getHoraries();
    getPhotographers();
    getClients();
    setLabelWidth(inputLabel.current.offsetWidth);
  }, [enqueueSnackbar]);

  async function getHoraries() {
    await api.get("/horary/active").then((response) => {
      setHoraries(response.data);
    });
  }

  async function getPhotographers() {
    await api.get("/photographer/active").then((response) => {
      setPhotographers(response.data);
    });
  }

  async function getClients() {
    await api.get("/client").then((response) => {
      setClients(response.data);
    });
  }

  function getAddress(address, lat, lng, city, district) {
    setAddress(address);
    setCity(city);
    setDistrict(district);
    setLat(lat);
    setLng(lng);

    handleInsertAddress(city, district);
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
            horizontal: "center",
          },
        });

        setFormatDate(
          value.slice(8, 10) + "/" + value.slice(5, 7) + "/" + value.slice(0, 4)
        );
      }
    } else {
      setHoraryDisable(false);
    }
  }

  async function getCalendarEvents(date) {
    await api
      .post(`/calendar/event/list`, { photographer_id, date })
      .then((response) => {
        setEvents(response.data);
        setHoraries(horaries);
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

  async function handleInsertAddress(city, district) {
    await api
      .post(`/city/byName`, { city })
      .then(async (response) => {
        setCityId(response.data[0].id);
        await api
          .post(`/district/byName`, {
            district,
            city_id: response.data[0].id,
          })
          .then(async (response) => {
            setDistrictId(response.data[0].id);
            setRegionId(response.data[0].region_id);
          });
      })
      .catch((error) => {
        enqueueSnackbar(
          "Problemas com endereço informado! Entre em contato pelo e-mail sheeephouse@gmail.com.",
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
  }

  async function handleSubmit() {
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
        if (!insertEvent) {
          const scheduling_id = response.data.id;
          await api
            .post(`/google/event/insertEvent`, {
              scheduling_id,
              horary,
              date,
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

  return (
    <Paper className={classes.paper}>
      <Typography component="h2" variant="h4">
        Agende a sessão de fotos
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
            <FormControl variant="outlined" fullWidth>
              <InputLabel ref={inputLabel} id="photographerSelect">
                Fotógrafos
              </InputLabel>
              <Select
                id="photographerSelect"
                labelWidth={labelWidth}
                value={photographer_id}
                onChange={(event) => {
                  setDateDisable(false);
                  setPhotographerId(event.target.value);
                }}
              >
                <MenuItem value="">-- Selecione --</MenuItem>
                {photographers.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
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

                    verifyDate(`${year}-${month}-${day}`);
                  }
                }}
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
                disabled={horaryDisable || dateDisable}
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
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel ref={inputLabel} id="clientSelect">
                Cliente
              </InputLabel>
              <Select
                id="clientSelect"
                labelWidth={labelWidth}
                value={client_id}
                onChange={(event) => {
                  setClientId(event.target.value);
                }}
              >
                <MenuItem value="">-- Selecione --</MenuItem>
                {clients.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
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
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              fullWidth
              className={classes.submit}
              onClick={() => {
                history.push("/scheduling");
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
              Agendar
            </Button>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
}

export default withSnackbar(Scheduling);
