import "date-fns";
import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from "@date-io/date-fns";
import { useParams } from "react-router-dom";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { makeStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";

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

function EditScheduling({ enqueueSnackbar }) {
  const classes = useStyles(),
    [horaries, setHoraries] = useState([]),
    [services, setServices] = useState([]),
    [servicesSelected, setServicesSelected] = useState([]),
    [photographers, setPhotographers] = useState([]),
    [horaryDisable, setHoraryDisable] = useState(true),
    [dateDisable, setDateDisable] = useState(true),
    [events, setEvents] = useState([]),
    [date, setDate] = useState(new Date()),
    [address, setAddress] = useState(""),
    [complement, setComplement] = useState(""),
    [comments, setComments] = useState(""),
    [accompanies, setAccompanies] = useState(false),
    [service_id, setServiceId] = useState([]),
    [photographer, setPhotographer] = useState([]),
    [photographer_id, setPhotographerId] = useState(""),
    [old_photographer_id, setOldPhotographerId] = useState(""),
    [horary, setHorary] = useState(""),
    [client_id, setClientId] = useState(""),
    [labelWidth, setLabelWidth] = useState(0),
    [scheduling_id, setSchedulingId] = useState(""),
    [scheduling, setScheduling] = useState([]),
    [broker, setBroker] = useState([]),
    [status, setStatus] = useState([]),
    inputLabel = React.useRef(null),
    { id } = useParams();

  useEffect(() => {
    setSchedulingId(id);
    getScheduling();
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  async function getScheduling() {
    await api.get(`/scheduling/${id}`).then(async (scheduling) => {
      setAddress(scheduling.data[0].address);
      setComplement(scheduling.data[0].complement);
      setComments(scheduling.data[0].comments);
      setClientId(scheduling.data[0].client_id);
      setPhotographerId(scheduling.data[0].photographer_id);
      setOldPhotographerId(scheduling.data[0].photographer_id);
      setScheduling(scheduling.data[0]);
      setDate(scheduling.data[0].date);
      setHorary(scheduling.data[0].horary);
      getPhotographers();

      let city, broker, 
        serviceInit = [],
        serviceSelectedInit = [];

      await api.get(`/city/${scheduling.data[0].city_id}`).then((cityResp) => {
        city = cityResp.data[0];
      });

      await api.get(`/client/${scheduling.data[0].client_id}`).then(async (client) => {
        await api.get(`/broker/${client.data[0].broker_id}`).then((brokerResp) => {
          setBroker(brokerResp.data[0]);
          broker = brokerResp.data[0];
        });
      });

      city.services.map((cityService) => {
        let service = {};

        service.id = cityService.id;
        service.name = cityService.name;
        service.checked = false;

        broker.services.map((brokerService) => {
          if(brokerService.id === cityService.id) {
            service.value = brokerService.pivot.price;
          }
        })

        scheduling.data[0].services.map((schedulingService) => {
          if(schedulingService.id === cityService.id) {
            service.checked = true;
            service.value = schedulingService.pivot.price;
            serviceSelectedInit.push(service);
          }
        })

        serviceInit.push(service);
      })

      setServices(serviceInit)
      setServicesSelected(serviceSelectedInit)
    });
  }

  async function getPhotographers() {
    await api.get("/photographer/active").then((response) => {
      setPhotographers(response.data);
    });
  }

  async function handleSubmit() {
    if (
      !date ||
      !address ||
      !photographer_id ||
      !horary ||
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
      codServicos.push(service.id);
      prices.push(service.value);
    });

    await api
      .put(`/scheduling/${id}`, {
        date,
        address,
        complement,
        comments,
        accompanies,
        photographer_id,
        horary,
        client_id,
        services: codServicos,
        prices,
      })
      .then(async (response) => {
        await api
          .post(`/google/event/editEvent`, {
            scheduling_id,
            old_photographer_id,
            horary,
            date
          })
          .then((response2) => {
            enqueueSnackbar("Sessão editada com sucesso!", {
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
        enqueueSnackbar("Problemas ao editar sessão!", {
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
        Editar a sessão | Código {id}
      </Typography>

      <div className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="text"
              onChange={(event) => {
                setAddress(event.target.value);
              }}
              value={address}
              label="Endereço"
              variant="outlined"
              fullWidth
            />
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
                Serviços
              </Typography>
            ) : (
              ""
            )}
            {services.map((service, index) => {
              return (
                <div
                  key={service.id}
                  className={classes.service}
                >
                  <div className={classes.serviceContent}>
                    <Checkbox
                      checked={service.checked}
                      onChange={() => {
                        let newServices = services;
                        let newServicesSelected = servicesSelected;
    
                        let removeu = false;
    
                        newServices[index].checked = !service.checked;
    
                        newServicesSelected = newServicesSelected.filter((item) => {
                          if(item.id == service.id){
                            removeu = true;
                          }
                          return item.id != service.id;
                        });
    
                        if(!removeu)  {
                          newServicesSelected.push(
                            {
                              'id': service.id, 
                              'name': service.name, 
                              'checked': service.checked,
                              'value': service.value
                            }
                          );
                        }
    
                        setServices([...newServices]);
                        setServicesSelected(newServicesSelected);
                      }}
                      value={service.checked}
                    />
                    <Typography component="h5" variant="h6" align="left">
                      {service.name}
                    </Typography>
                    <TextField
                      onChange={(event) => {
                        let newServices = services;
                        let newServicesSelected = servicesSelected;

                        newServices = newServices.map((item) => {
                          if(item.id == service.id){
                            item.value = event.target.value;
                          }
                          return item;
                        });
                        
                        newServicesSelected = newServicesSelected.map((item) => {
                          if(item.id == service.id){
                            item.value = event.target.value;
                          }
                          return item;
                        });

                        setServices([...newServices]);
                        setServicesSelected(newServicesSelected);
                      }}
                      value={service.value}
                      label="Valor"
                      variant="outlined"
                    />
                  </div>
                </div>
              );
            })}
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
            <TextField
              type="text"
              onChange={(event) => {
                setHorary(event.target.value);
              }}
              value={horary}
              label="Horário"
              variant="outlined"
              fullWidth
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
              Salvar
            </Button>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
}

export default withSnackbar(EditScheduling);
