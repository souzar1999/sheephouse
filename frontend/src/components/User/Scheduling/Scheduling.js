import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from "@date-io/date-fns";
import Container from "@material-ui/core/Container";

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
    marginTop: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "40px",
    backgroundColor: "rgba(255, 255, 255, .75)",
    boxShadow: 'none'
  },
  submit: {
    width: "100%",
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none',
    backgroundColor: '#051673'
  },
  submitBack: {
    width: "100%",
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none',
    backgroundColor: '#e0e0e0'
  },
  container: {
    marginRight: "unset",
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
  logo: {
    position: "relative",
    display: "block",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
  },
  input: {
    borderRadius: "9px",
    marginTop: theme.spacing(1),
    '& .MuiOutlinedInput-root': {
      borderRadius: "9px",
      '& .MuiOutlinedInput-input': {
        borderRadius: "9px",
      },
    },
  },
  checkServices: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  }
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
    [broker, setBroker] = useState([]),
    [photographer_sabado, setPhotographerSabado] = useState([]),
    [photographer_id, setPhotographerId] = useState(""),
    [horary_id, setHoraryId] = useState(""),
    [servicesSelected, setServicesSelected] = useState([]),
    [servicesString, setServicesString] = useState(""),
    [valorTotal, setValorTotal] = useState(),
    [client_id, setClientId] = useState(clientCode),
    [labelWidth, setLabelWidth] = useState(0),
    script = document.createElement("script"),
    queryString = window.location.search,
    urlParams = new URLSearchParams(queryString),
    loginEmail = urlParams.get("login");

  script.src = "https://apis.google.com/js/client.js";

  useEffect(() => {
    if (step === 0) {
      getPhotographerSabado();
      setServicesString("");
    }
    if (step === 1) {
      getBroker();
    }
  }, [step]);

  useEffect(() => {
    getClientByEmail(loginEmail);
  }, [loginEmail]);

  async function getClientByEmail(loginEmail) {
    await api.get(`/client/email/${loginEmail}`).then((response) => {
      setClientId(response.data.id);
    });
  }

  async function getBroker() {
    await api.get(`/client/${client_id}`).then(async (response) => {
      await api.get(`/broker/${response.data[0].broker_id}`).then((response) => {

        let newServices = []
        services.map((service, index) => {
          const brokerService = response.data[0].services.filter(serviceBroker => {
            return serviceBroker.pivot.service_id == service.pivot.service_id
          })

          newServices.push({
            ...service,
            price: brokerService[0] ? brokerService[0].pivot.price : 0
          })
        })

        setServices(newServices);

        setBroker(response.data[0]);
      });
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
    if (servicesSelected.length == 0) {
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

      let codServicos = [],
        prices = [];
  
      servicesSelected.map((service) => {
        codServicos.push(service.service_id);
        prices.push(service.price);
      });
  
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
          services: codServicos,
          prices
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

    let serviceString = "",
      valorTotal = 0;

    services.map((service) => {
      if (service.checked) {
        valorTotal += service.price;
        serviceString += ` ${service.name},`;
      }
    });

    setValorTotal(valorTotal);
    setServicesString(serviceString);

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

    let codServicos = [],
      prices = [];

    servicesSelected.map((service) => {
      codServicos.push(service.service_id);
      prices.push(service.price);
    });

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
        services: codServicos,
        prices
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
      <Container component="main" maxWidth="xs" className={classes.container}>
        <Paper 
          className={classes.paper} 
          direction="row"
          justifyContent="center"
          alignItems="center">
          <Grid 
            container
            justifyContent="space-between"
          >
            <Grid item>
              <Typography component="h6" variant="caption" align="left">
                Insira os dados do seu
              </Typography>
              <Typography component="h6" variant="h3" align="left">
                Imóvel
              </Typography>
            </Grid>
            <Grid item>
              <img src="./assets/sheephouse.png" alt="Sheep House" height={45} className={classes.logo}/>
            </Grid>
          </Grid>

          <div className={classes.form}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography component="caption" variant="caption" align="left" style={{whiteSpace: 'nowrap', color: '#000', fontSize: '.9rem'}}>
                  Qual o endereço do imóvel?
                </Typography>
                <Maps className={classes.input} addressInfo={getAddress} address={address} />
              </Grid>
              <Grid item xs={12}>
                <Typography component="caption" variant="caption" align="left" style={{whiteSpace: 'nowrap', color: '#000', fontSize: '.9rem'}}>
                  Complemento
                </Typography>
                <TextField
                  type="text"
                  onChange={(event) => {
                    setComplement(event.target.value);
                  }}
                  className={classes.input} 
                  value={complement}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography component="caption" variant="caption" align="left" style={{whiteSpace: 'nowrap', color: '#000', fontSize: '.9rem'}}>
                  Observações
                </Typography>
                <TextField
                  onChange={(event) => {
                    setComments(event.target.value);
                  }}
                  className={classes.input} 
                  value={comments}
                  variant="outlined"
                  rows="3"
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid container style={{width: '100%', marginBottom: '10px', justifyContent: "end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  style={{ width: "50% "}}
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
      </Container>
    );
  }

  if (step === 1) {
    return (
      <Container component="main" maxWidth="xs" className={classes.container}>
        <Paper 
          className={classes.paper} 
          direction="row"
          justifyContent="center"
          alignItems="center">
          <Grid 
            container
            justifyContent="space-between"
          >
            <Grid item>
              <Typography component="h6" variant="caption" align="left">
                Selecione o
              </Typography>
              <Typography component="h6" variant="h3" align="left">
                Serviço
              </Typography>
            </Grid>
            <Grid item>
              <img src="./assets/sheephouse.png" alt="Sheep House" height={45} className={classes.logo}/>
            </Grid>
          </Grid>

          <div className={classes.form}>
            <Grid container>
              {services.map((service, index) => {
                if(service.price) {
                  return (
                    <Grid 
                      item 
                      xs={12}
                      key={service.id}
                    >
                      <FormGroup row className={classes.checkServices}>
                        <FormControlLabel
                          label={service.name}
                          control={
                            <Checkbox
                              color="primary"
                              checked={service.checked}
                              onChange={(event) => {
                                let newServices = services;
                                let newServiceSelected = servicesSelected;
        
                                let removeu = false;
        
                                newServices[index].checked = !service.checked;
        
                                newServiceSelected = newServiceSelected.filter((item) => {
                                  if(item.service_id == service.id){
                                    removeu = true;
                                  }
                                  return item.service_id != service.id;
                                });
        
                                if(!removeu)  {
                                  newServiceSelected.push(
                                    {
                                      'service_id': service.id, 
                                      'price': service.price
                                    }
                                  );
                                }
        
                                setServices([...newServices]);
                                setServicesSelected(newServiceSelected);
                              }}
                              value={service.checked}
                            />
                          }
                        />
                      </FormGroup>
                    </Grid>
                  );
                }
              })}
              <Grid item xs={12}>
                <FormGroup row className={classes.checkServices}>
                  <FormControlLabel
                    label="Retirada de Chaves"
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
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="info"
                  className={classes.submitBack}
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
      </Container>
    );
  }

  if (step === 2) {
    return (
      <Container component="main" maxWidth="xs" className={classes.container}>
        <Paper 
          className={classes.paper} 
          direction="row"
          justifyContent="center"
          alignItems="center">
          <Grid 
            container
            justifyContent="space-between"
          >
            <Grid item>
              <Typography component="h6" variant="caption" align="left">
                Selecione o
              </Typography>
              <Typography component="h6" variant="h3" align="left">
                Dia
              </Typography>
            </Grid>
            <Grid item>
              <img src="./assets/sheephouse.png" alt="Sheep House" height={45} className={classes.logo}/>
            </Grid>
          </Grid>

          <div className={classes.form}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography component="caption" variant="caption" align="left" style={{whiteSpace: 'nowrap', color: '#000', fontSize: '.9rem'}}>
                  Selecione a Data
                </Typography>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    autoOk
                    value={date}
                    inputVariant="outlined"
                    fullWidth
                    className={classes.input} 
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
                <Typography component="caption" variant="caption" align="left" style={{whiteSpace: 'nowrap', color: '#000', fontSize: '.9rem'}}>
                  Selecione o Horário
                </Typography>
                <FormControl variant="outlined" fullWidth>
                  <Select
                    id="horarySelect"
                    labelWidth={labelWidth}
                    value={horary_id}
                    disabled={horaryDisable}
                    className={classes.input} 
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
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="info"
                  className={classes.submitBack}
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
      </Container>
    );
  }

  if (step === 3) {
    return (
      <Container component="main" maxWidth="xs" className={classes.container}>
        <Paper 
          className={classes.paper} 
          direction="row"
          justifyContent="center"
          alignItems="center">
          <Grid 
            container
            justifyContent="space-between"
          >
            <Grid item>
              <Typography component="h6" variant="caption" align="left">
                Complete o agendamento da
              </Typography>
              <Typography component="h6" variant="h3" align="left">
                Sessão
              </Typography>
            </Grid>
            <Grid item>
              <img src="./assets/sheephouse.png" alt="Sheep House" height={45} className={classes.logo}/>
            </Grid>
          </Grid>

          <div className={classes.form}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  type="text"
                  value={address}
                  label="Endereço"
                  variant="outlined"
                  className={classes.input} 
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
                  className={classes.input} 
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="text"
                  value={servicesString.slice(0, -1)}
                  label="Serviços"
                  variant="outlined"
                  className={classes.input} 
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
                  className={classes.input} 
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
                  className={classes.input} 
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="info"
                  className={classes.submitBack}
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
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  clientCode: state.clientCode,
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(Scheduling);
