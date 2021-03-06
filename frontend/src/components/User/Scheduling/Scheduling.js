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
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import moment from "moment";

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
  service: {
    width: "100%",
    height: "60px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "6px",
    borderRadius: "4px",
    padding: "8px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#efefef",
      boxShadow:
        "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
    },
  },
  serviceContent: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "50px",
    marginRight: "50px",
  },
}));

function Scheduling({ enqueueSnackbar, clientCode }) {
  const classes = useStyles(),
    [step, setStep] = useState(0),
    [horaries, setHoraries] = useState([]),
    [services, setServices] = useState([]),
    [horary, setHorary] = useState(""),
    [retirar_chaves, setRetirarChaves] = useState(false),
    [city, setCity] = useState(""),
    [district, setDistrict] = useState(""),
    [horaryDisable, setHoraryDisable] = useState(true),
    [events, setEvents] = useState([]),
    [date, setDate] = useState(moment()),
    [latitude, setLat] = useState(""),
    [longitude, setLng] = useState(""),
    [address, setAddress] = useState(""),
    [complement, setComplement] = useState(""),
    [comments, setComments] = useState(""),
    [accompanies, setAccompanies] = useState(false),
    [region_id, setRegionId] = useState(""),
    [city_id, setCityId] = useState(""),
    [service_id, setServiceId] = useState([]),
    [district_id, setDistrictId] = useState(""),
    [photographer, setPhotographer] = useState([]),
    [photographer_sabado, setPhotographerSabado] = useState([]),
    [photographer_id, setPhotographerId] = useState(""),
    [horary_id, setHoraryId] = useState(""),
    [servicesSelected, setServicesSelected] = useState(""),
    client_id = clientCode,
    [labelWidth, setLabelWidth] = useState(0),
    inputLabel = React.useRef(null),
    script = document.createElement("script");

  script.src = "https://apis.google.com/js/client.js";

  useEffect(() => {
    if (step === 0) {
      getPhotographerSabado();
      setServicesSelected("");
      setServices(city.services);
    }
    if (step === 2) {
      setLabelWidth(inputLabel.current.offsetWidth);
    }
  }, [step]);

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
            await api
              .post(`/photographer/byRegion`, {
                region_id: response.data[0].region_id,
              })
              .then(async (response) => {
                setPhotographer(response.data[0]);
                setPhotographerId(response.data[0].id);
              });
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
  }

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
        } else if (dia_semana === 6) {
          getHoraries(date, dia_semana, photographer_sabado[0].id);
        }
      });
  }

  async function getEvents(date, photographer_id) {
    await api
      .post(`/calendar/event/list`, {
        photographer_id,
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

  function handleReturnStep() {
    setStep(step - 1);
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

    if (
      !latitude ||
      !longitude ||
      !address ||
      !region_id ||
      !city_id ||
      !district_id ||
      !photographer_id
    ) {
      enqueueSnackbar(
        "Problemas com o endereço informado, entre em contato com o administrador!",
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

    enqueueSnackbar("Fotográfo foi selecionado pelo endereço informado!", {
      variant: "success",
      autoHideDuration: 5000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
    });

    enqueueSnackbar("Selecione os serviços que deseja para prosseguir!", {
      variant: "success",
      autoHideDuration: 5000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
    });

    setStep(1);
  }

  async function handleSubmitStep1() {
    if (service_id.length == 0) {
      enqueueSnackbar("Necessário selecionar um serviço para prosseguir", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (retirar_chaves) {
      if (
        !latitude ||
        !longitude ||
        !address ||
        !region_id ||
        !city_id ||
        !district_id ||
        !photographer_id ||
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
          latitude,
          longitude,
          address,
          complement,
          comments,
          region_id,
          city_id,
          district_id,
          photographer_id,
          client_id,
          accompanies,
          actived: false,
          retirar_chaves,
          services: service_id,
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
    }

    let serviceString = "";

    services.map((service) => {
      if (service.checked) {
        serviceString += ` ${service.name},`;
      }
    });

    setServicesSelected(serviceString);

    setDate(moment());
    setHoraryDisable(true);
    setHoraryId();
    setEvents([]);
    setStep(2);

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
  }

  async function handleSubmitStep2() {
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

    setStep(3);
  }

  async function handleSubmitStep3() {
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
      !service_id
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
        services: service_id,
      })
      .then(async (response) => {
        const scheduling_id = response.data.id;
        await api
          .post(`/google/event/insertEvent`, {
            scheduling_id,
            horary,
            date: date.format("YYYY-MM-DD"),
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
          Selecione os serviços
        </Typography>

        <div className={classes.form}>
          <Grid container spacing={2}>
            {services.map((service, index) => {
              return (
                <div
                  key={service.id}
                  className={classes.service}
                  onClick={() => {
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
                >
                  <div className={classes.serviceContent}>
                    <Typography component="h5" variant="h6" align="left">
                      {service.name}
                    </Typography>
                    {service.checked ? (
                      <CheckBoxIcon />
                    ) : (
                      <CheckBoxOutlineBlankIcon />
                    )}
                  </div>
                </div>
              );
            })}
            <Grid item xs={12}>
              <FormGroup row>
                <FormControlLabel
                  label="Retirar chaves na imobiliária"
                  control={
                    <Checkbox
                      color="primary"
                      checked={retirar_chaves}
                      onChange={(event) => {
                        setRetirarChaves(!retirar_chaves);
                      }}
                      value={retirar_chaves}
                    />
                  }
                />
              </FormGroup>
              <small style={{ float: "left", fontStyle: "italic" }}>
                Para IMÓVEIS desocupados a Sheep House fornece serviço de
                retirada de chaves.
              </small>
              <br />
              <small style={{ float: "left", fontStyle: "italic" }}>
                Para serviços de filmagem interna ou serviços com drone
              </small>
              {retirar_chaves && (
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
          Quando será a sessão de fotos
        </Typography>

        <div className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  autoOk
                  value={date}
                  inputVariant="outlined"
                  fullWidth
                  label="Data da Sessão"
                  onChange={(value) => {
                    console.log(value);
                    let date = moment(value);
                    console.log(date);

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

                    console.log("horario: " + dateHorary._i);

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

                        console.log("start: " + eventStart._i);
                        console.log("end: " + eventEnd._i);
                        console.log(dateHorary.clone().add(1, "seconds"));
                        console.log(dateHorary.clone().add(1, "seconds"));

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
                Continuar
              </Button>
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }

  if (step === 3) {
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
                value={servicesSelected.slice(0, -1)}
                label="Serviços"
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
                value={moment(date).format("DD/MM/YYYY")}
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
                  handleSubmitStep3();
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
