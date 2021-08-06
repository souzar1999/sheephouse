import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import DateFnsUtils from "@date-io/date-fns";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import SendIcon from "@material-ui/icons/Send";
import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";
import VideocamIcon from "@material-ui/icons/Videocam";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import EventIcon from "@material-ui/icons/Event";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import api from "../../../services/api";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";

import moment from "moment";

import history from "../../../history";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(2),
    width: `100%`,
  },
  filter: {
    marginTop: theme.spacing(2),
  },
  submit: {
    padding: theme.spacing(1, 1),
  },
  tableRow: {
    "&:nth-of-type(4n+1)": {
      backgroundColor: "#eee",
    },
    "&:nth-of-type(4n+2)": {
      backgroundColor: "#eee",
    },
  },
  tableCell: {
    borderBottom: 0,
  },
}));

function TablePaginationActions (props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div style={{flexShrink: 0, marginLeft: theme.spacing(2.5)}}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="Primeira página"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="Página anterior">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Próxima página"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Última página"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

function Scheduling({ enqueueSnackbar, clientCode }) {
  const classes = useStyles();
  const [clients, setClients] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [services, setServices] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [status, setStatus] = useState([
    "Cancelado",
    "Pendente",
    "Ativo",
    "Enviado",
    "Concluído",
  ]);
  const [schedulings, setScheduling] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const [address, setAddress] = useState("");
  const [dateIni, setDateIni] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [statusId, setStatusId] = useState([]);
  const [clientsId, setClientsId] = useState([]);
  const [brokersId, setBrokersId] = useState([]);
  const [servicesId, setServicesId] = useState([]);
  const [photographersId, setPhotographersId] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [labelWidth, setLabelWidth] = useState(0);
  const inputLabel = React.useRef(null);

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
    handleFilter();
    handleLoadLookup();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  async function handleLoadLookup() {
    await api.get("/photographer").then((response) => {
      setPhotographers(response.data);
    });

    if(!clientCode) {
      await api.get("/client").then((response) => {
        setClients(response.data);
      });  

      await api.get("/broker").then((response) => {
        setBrokers(response.data);
      });  
    }
    
    await api.get("/service").then((response) => {
      let data = [];

      response.data.map((item) => {
        return (data[item.id] = item.name);
      });

      setServices(data);
    });
  }

  async function handleFilter() {
    await api
      .get("/scheduling", {
        params: {
          photographersId,
          address,
          statusId,
          clientsId: clientCode ? clientCode : clientsId,
          brokersId: clientCode ? [] : brokersId,
          servicesId,
          dateIni,
          dateEnd,
          page,
          rowsPerPage,
        },
      })
      .then((response) => {
        let schedulingsData = [];

        response.data.data.forEach((item) => {
          if (!item.actived) {
            item.status = 0;
          } else if (item.downloaded) {
            item.status = 4;
          } else if (item.completed) {
            item.status = 3;
          } else if (
            new Date(`${item.date}T00:00:00-03:00`) <= new Date() &&
            new Date(`${item.date}T23:59:59-03:00`) >= new Date()
          ) {
            item.status = 1;
          } else {
            item.status = 2;
          }

          schedulingsData.push(item);
        });

        setScheduling(schedulingsData);
        setTotalRows(response.data.total);
      });
  }

  function handleClean() {
    setAddress("");
    setClientsId([]);
    setBrokersId([]);
    setDateIni(null);
    setDateEnd(null);
    setPhotographersId([]);
    setStatusId([]);
    setServicesId([]);
  }

  async function resendEmail(id) {
    await api.get(`/scheduling/${id}/resend`).then((response) => {
      enqueueSnackbar("Email reenviado!", {
        variant: "success",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    });
  }

  return (
    <>
      <Paper className={classes.paper}>
        <Typography component="h2" variant="h4">
          Agendamentos
        </Typography>

        <Grid className={classes.filter} container spacing={2}>
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
          <Grid item xs={12} sm={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                autoOk
                value={dateIni ? moment(dateIni) : null}
                inputVariant="outlined"
                fullWidth
                label="Data da Inicial"
                onChange={(value) => {
                  let date = moment(value).format("YYYY-MM-DD");
                  setDateIni(date);
                }}
                format="dd/MM/yyyy"
                cancelLabel="Cancelar"
                invalidDateMessage="Data em formato inválido."
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                autoOk
                value={dateEnd ? moment(dateEnd) : null}
                inputVariant="outlined"
                fullWidth
                label="Data da Final"
                onChange={(value) => {
                  let date = moment(value).format("YYYY-MM-DD");
                  setDateEnd(date);
                }}
                format="dd/MM/yyyy"
                cancelLabel="Cancelar"
                invalidDateMessage="Data em formato inválido."
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel ref={inputLabel} id="statusSelect">
                Status
              </InputLabel>
              <Select
                id="statusSelect"
                labelWidth={labelWidth}
                value={statusId}
                multiple
                onChange={(event) => {
                  setStatusId(event.target.value);
                }}
              >
                {status.map((item, index) => {
                  return (
                    <MenuItem key={index} value={index}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel ref={inputLabel} id="servicesSelect">
                Serviços
              </InputLabel>
              <Select
                id="servicesSelect"
                labelWidth={labelWidth}
                value={servicesId}
                multiple
                onChange={(event) => {
                  setServicesId(event.target.value);
                }}
              >
                {services.map((item, index) => {
                  return (
                    <MenuItem key={index} value={index}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel ref={inputLabel} id="photographerSelect">
                Fotógrafos
              </InputLabel>
              <Select
                id="photographerSelect"
                labelWidth={labelWidth}
                value={photographersId}
                multiple
                onChange={(event) => {
                  setPhotographersId(event.target.value);
                }}
              >
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
          <Grid style={{ display: clientCode ? "none" : "inline-flex" }} item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel ref={inputLabel} id="clientsSelect">
                Clientes
              </InputLabel>
              <Select
                id="clientsSelect"
                labelWidth={labelWidth}
                value={clientsId}
                multiple
                onChange={(event) => {
                  setClientsId(event.target.value);
                }}
              >
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
          <Grid style={{ display: clientCode ? "none" : "inline-flex" }} item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel ref={inputLabel} id="brokersSelect">
                Imobiliárias
              </InputLabel>
              <Select
                id="brokersSelect"
                labelWidth={labelWidth}
                value={brokersId}
                multiple
                onChange={(event) => {
                  setBrokersId(event.target.value);
                }}
              >
                {brokers.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={4} className={classes.submit}>
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={() => {
                  handleClean();
                }}
              >
                Limpar
              </Button>
            </Grid>
            <Grid item xs={8} className={classes.submit}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                fullWidth
                onClick={() => {
                  handleFilter();
                }}
              >
                Filtrar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <IconButton
                  style={{ display: clientCode ? "none" : "inline-flex" }}
                  title="Agendar"
                  onClick={() => history.push(`/admin/scheduling/`)}
                  component="span"
                >
                  <AddIcon />
                </IconButton>
              </TableCell>
              <TableCell align="left">Serviço</TableCell>
              <TableCell align="center">Data/Hora</TableCell>
              <TableCell align="left">Cliente</TableCell>
              <TableCell align="left">Fotógrafo</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedulings.map((scheduling) => {
              return (
                <>
                  <TableRow className={classes.tableRow}>
                    <TableCell className={classes.tableCell} style={{display: 'flex', justifyContent: 'space-evenly'}} align="center">
                      <IconButton
                        style={{ display: clientCode ? "none" : "inline-flex" }}
                        title="Editar"
                        onClick={() =>
                          history.push(`admin/edit/scheduling/${scheduling.id}`)
                        }
                        component="span"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        style={{
                          display:
                            clientCode ||
                            !scheduling.completed ||
                            !scheduling.actived ||
                            !scheduling.date ||
                            scheduling.downloaded
                              ? "none"
                              : "inline-flex",
                        }}
                        title="Reenviar email"
                        onClick={() => resendEmail(scheduling.id)}
                        component="span"
                        size="small"
                      >
                        <SendIcon />
                      </IconButton>
                      <IconButton
                        style={{
                          display:
                            (clientCode && !scheduling.photo_link) ||
                            !scheduling.actived ||
                            !scheduling.date
                              ? "none"
                              : "inline-flex",
                        }}
                        title="Fotos"
                        onClick={() => {
                          if (!clientCode) {
                            history.push(
                              `filemanager/${scheduling.id}`
                            );
                          } else {
                            window.open(scheduling.photo_link);
                          }
                        }}
                        component="span"
                        size="small"
                      >
                        <PhotoLibraryIcon />
                      </IconButton>
                      <IconButton
                        style={{
                          display:
                            (clientCode && !scheduling.video_link) || !clientCode
                              ? "none"
                              : "inline-flex",
                        }}
                        title="Videos"
                        onClick={() => {
                          window.open(scheduling.video_link);
                        }}
                        component="span"
                        size="small"
                      >
                        <VideocamIcon />
                      </IconButton>
                      <IconButton
                        style={{
                          display:
                            (clientCode && !scheduling.video_link) || !clientCode
                              ? "none"
                              : "inline-flex",
                        }}
                        title="Tour 360"
                        onClick={() => {
                          window.open(scheduling.tour_link);
                        }}
                        component="span"
                        size="small"
                      >
                        <CameraEnhanceIcon />
                      </IconButton>
                      <IconButton
                        style={{
                          display: scheduling.completed || !scheduling.actived || !scheduling.date
                              ? "none"
                              : "inline-flex",
                        }}
                        title="Reagendar/Cancelar"
                        onClick={() => {
                          history.push(`/scheduling/${scheduling.id}`)
                        }}
                        component="span"
                        size="small"
                      >
                        <EventIcon />
                      </IconButton>
                      <IconButton
                        style={{
                          display: scheduling.date || clientCode
                              ? "none"
                              : "inline-flex",
                        }}
                        title="Agendar"
                        onClick={() => {
                          history.push(`/scheduling/${scheduling.id}`);
                        }}
                        component="span"
                        size="small"
                      >
                        <EventIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell className={classes.tableCell} align="left">
                      {scheduling.services
                        .map((service) => `${service.name} (R$ ${service.pivot.price})`)
                        .join(", ")}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {(scheduling.date ? 
                        `${moment(scheduling.date).format("DD/MM/YYYY")} - ${scheduling.horary}` : 
                        'Administrador irá agendar'
                      )}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="left">
                      {scheduling.client.name}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="left">
                      {scheduling.photographer.name}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {status[scheduling.status]}
                    </TableCell>
                  </TableRow>
                  <TableRow className={classes.tableRow}>
                    <TableCell></TableCell>
                    <TableCell colSpan="5">
                      Endereço: {scheduling.address}
                      <br/>
                      {scheduling.complement ?
                          `Complemento: ${scheduling.complement}` : ''
                      }
                      <br/>
                      {scheduling.comments ? 
                          `Observações: ${scheduling.comments}` : ''
                      }
                    </TableCell>
                  </TableRow>
                </>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="Registros por Página"
          ActionsComponent={TablePaginationActions}
        />
      </Paper>
    </>
  );
}

const mapStateToProps = (state) => ({
  clientCode: state.clientCode,
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(Scheduling);