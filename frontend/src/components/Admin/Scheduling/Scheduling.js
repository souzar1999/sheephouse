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

import moment from "moment";

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
    [services, setServices] = useState([]),
    [photographers, setPhotographers] = useState([]),
    [clients, setClients] = useState([]),
    [horary, setHorary] = useState(""),
    [city, setCity] = useState(""),
    [district, setDistrict] = useState(""),
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
    [region_id, setRegionId] = useState(""),
    [city_id, setCityId] = useState(""),
    [service_id, setServiceId] = useState([]),
    [district_id, setDistrictId] = useState(""),
    [photographer, setPhotographer] = useState([]),
    [photographer_id, setPhotographerId] = useState(""),
    [horary_id, setHoraryId] = useState(""),
    [client_id, setClientId] = useState(""),
    [client, setClient] = useState([]),
    [labelWidth, setLabelWidth] = useState(0),
    inputLabel = React.useRef(null),
    script = document.createElement("script");

  script.src = "https://apis.google.com/js/client.js";

  useEffect(() => {
    getPhotographers();
    getClients();
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

  async function getEvents(date, photographer_id) {
    await api
      .post(`/calendar/event/list`, { photographer_id, date })
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

  async function handleInsertAddress(city, district) {
    await api
      .post(`/city/byName`, { city })
      .then(async (response) => {
        setCityId(response.data[0].id);
        setServices(response.data[0].services);
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
      !horary ||
      !client_id ||
      !services
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
        date: date.format("YYYY-MM-DD"),
        latitude,
        longitude,
        address,
        complement,
        comments,
        accompanies,
        region_id,
        city_id,
        district_id,
        photographer_id,
        horary,
        client_id,
        email: client.email,
        services: service_id,
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

  return (
    <Paper className={classes.paper}>
      <Typography component="h2" variant="h4">
        Agende a sessão de fotos
      </Typography>

      <div className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Maps addressInfo={getAddress} address={address} />
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
                  setPhotographer(
                    photographers.find(
                      (photographer) => photographer.id === event.target.value
                    )
                  );
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
            {services.length > 0 ? (
              <Typography component="h5" variant="h5">
                Selecione os serviços
              </Typography>
            ) : (
              ""
            )}
            {services.map((service, index) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={service.checked}
                      onChange={(event) => {
                        let newServices = services;
                        let newServiceId = service_id;

                        newServices[index].checked = !service.checked;

                        if (newServiceId.includes(service.id)) {
                          newServiceId = newServiceId.filter((item) => {
                            return item != service.id;
                          });
                        } else {
                          newServiceId.push(service.id);
                        }

                        setServices([...newServices]);
                        setServiceId([...newServiceId]);
                      }}
                      name={`services[${service.id}]`}
                      id={`service${service.id}`}
                      color="primary"
                      value={service.id}
                    />
                  }
                  label={service.name}
                />
              );
            })}
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
                disabled={horaryDisable || dateDisable}
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
                onChange={async (event) => {
                  setClientId(event.target.value);

                  await api.get(`/client/${event.target.value}`).then((response) => {
                    if(!response.data.id){
                      setClient(response.data[0]);
                    }
                  });
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
