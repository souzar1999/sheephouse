import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { withSnackbar } from "notistack";

import api from "../../../services/api";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    width: "100%",
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

function Home({ enqueueSnackbar }) {
  const classes = useStyles();
  const [today, setToday] = useState([]),
    [tomorrow, setTomorrow] = useState([]),
    [completedPhoto, setCompletedPhoto] = useState(0),
    [completedDrone, setCompletedDrone] = useState(0),
    [canceled, setCanceled] = useState(0),
    [Clients, setClients] = useState([]),
    [Photographers, setPhotographers] = useState([]),
    [Horaries, setHoraries] = useState([]),
    [dateToday, setDateToday] = useState(""),
    [dateTomorrow, setDateTomorrow] = useState(""),
    columns = [
      {
        title: "Horario",
        field: "horary_id",
        defaultSort: "desc",
        lookup: { ...Horaries },
        cellStyle: {
          width: 120,
          maxWidth: 120,
          textAlign: "center"
        },
        headerStyle: {
          width: 120,
          maxWidth: 120
        }
      },
      {
        title: "Cliente",
        field: "client_id",
        defaultSort: "asc",
        lookup: { ...Clients }
      },
      {
        title: "Fotografo",
        field: "photographer_id",
        defaultSort: "asc",
        render: rowData => {
          const name = rowData.photographer.name.split(" ");
          return name[0];
        },
        lookup: { ...Photographers }
      }
    ];

  useEffect(() => {
    let date = new Date(),
      year = date.getFullYear(),
      mn = date.getMonth(),
      day = date.getDate(),
      dayIni = new Date(year, mn, 1).getDate(),
      dayEnd = new Date(year, mn + 1, 0).getDate(),
      td = new Date(year, mn, day).getDate(),
      tm = new Date(year, mn, day + 1).getDate(),
      today = td < 10 ? `0${td}` : td,
      tomorrow = tm < 10 ? `0${tm}` : tm,
      month = mn + 1 < 10 ? `0${mn + 1}` : mn + 1;

    setDateToday(`${today}/${month}/${year}`);
    setDateTomorrow(`${tomorrow}/${month}/${year}`);

    handleLoadMonthCompleted(year, month, dayIni, dayEnd);
    handleLoadMonthCanceled(year, month, dayIni, dayEnd);
    handleLoadToday(year, month, today);
    handleLoadTomorrow(year, month, tomorrow);
    handleLoadLookup();
  }, []);

  async function handleLoadLookup() {
    await api.get("/photographer").then(response => {
      let data = [];

      response.data.map(item => {
        return (data[item.id] = item.name);
      });

      setPhotographers(data);
    });

    await api.get("/horary/active").then(response => {
      let data = [];

      response.data.map(item => {
        return (data[item.id] = item.time);
      });

      setHoraries(data);
    });

    await api.get("/client/active").then(response => {
      let data = [];

      response.data.map(item => {
        return (data[item.id] = `${item.name} (${item.broker.name})`);
      });

      setClients(data);
    });
  }

  async function handleLoadMonthCompleted(year, month, dayIni, dayEnd) {
    await api
      .get(
        `/scheduling/completed/month/${year}-${month}-0${dayIni}/${year}-${month}-${dayEnd}`
      )
      .then(response => {
        let drone = 0,
          photo = 0;
        response.data.forEach((item, index) => {
          if (item.drone) {
            drone++;
          } else {
            photo++;
          }
        });

        setCompletedDrone(drone);
        setCompletedPhoto(photo);
      });
  }

  async function handleLoadMonthCanceled(year, month, dayIni, dayEnd) {
    await api
      .get(
        `/scheduling/canceled/month/${year}-${month}-0${dayIni}/${year}-${month}-${dayEnd}`
      )
      .then(response => {
        setCanceled(response.data);
      });
  }

  async function handleLoadToday(year, month, today) {
    await api
      .get(`/scheduling/day/${year}-${month}-${today}`)
      .then(response => {
        setToday(response.data);
      });
  }

  async function handleLoadTomorrow(year, month, tomorrow) {
    await api
      .get(`/scheduling/day/${year}-${month}-${tomorrow}`)
      .then(response => {
        setTomorrow(response.data);
      });
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h1>Sessões do mês</h1>
              </Grid>
              <Grid item xs={4}>
                <h3>Fotos: {completedPhoto}</h3>
              </Grid>
              <Grid item xs={4}>
                <h3>Drone: {completedDrone}</h3>
              </Grid>
              <Grid item xs={4}>
                <h3>Canceladas: {canceled}</h3>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <MaterialTable
              title={`Agendamentos de hoje (${dateToday})`}
              columns={columns}
              data={today}
              localization={{
                body: {
                  emptyDataSourceMessage: "Sem registros para mostrar"
                },
                header: {
                  actions: "Ações"
                },
                toolbar: {
                  searchTooltip: "Pesquisar",
                  searchPlaceholder: "Pesquisar"
                },
                pagination: {
                  labelRowsSelect: "Registros",
                  labelRowsPerPage: "Registros por página",
                  firstAriaLabel: "Primeira Página",
                  firstTooltip: "Primeira Página",
                  previousAriaLabel: "Página Anterior",
                  previousTooltip: "Página Anterior",
                  nextAriaLabel: "Página Seguinte",
                  nextTooltip: "Página Seguinte",
                  lastAriaLabel: "Última Página",
                  lastTooltip: "Última Página"
                }
              }}
              options={{
                search: false
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <MaterialTable
              title={`Agendamentos de amanhã (${dateTomorrow})`}
              columns={columns}
              data={tomorrow}
              localization={{
                body: {
                  emptyDataSourceMessage: "Sem registros para mostrar"
                },
                header: {
                  actions: "Ações"
                },
                toolbar: {
                  searchTooltip: "Pesquisar",
                  searchPlaceholder: "Pesquisar"
                },
                pagination: {
                  labelRowsSelect: "Registros",
                  labelRowsPerPage: "Registros por página",
                  firstAriaLabel: "Primeira Página",
                  firstTooltip: "Primeira Página",
                  previousAriaLabel: "Página Anterior",
                  previousTooltip: "Página Anterior",
                  nextAriaLabel: "Página Seguinte",
                  nextTooltip: "Página Seguinte",
                  lastAriaLabel: "Última Página",
                  lastTooltip: "Última Página"
                }
              }}
              options={{
                search: false
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default withSnackbar(Home);
