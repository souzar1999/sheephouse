import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { withSnackbar } from "notistack";

import api from "../../../services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    width: "100%",
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function Home({ enqueueSnackbar }) {
  const classes = useStyles(),
    [today, setToday] = useState([]),
    [tomorrow, setTomorrow] = useState([]),
    [Clients, setClients] = useState([]),
    [Photographers, setPhotographers] = useState([]),
    [dateToday, setDateToday] = useState(""),
    [dateTomorrow, setDateTomorrow] = useState(""),
    columns = [
      {
        title: "Horario",
        field: "horary",
        defaultSort: "desc",
        cellStyle: {
          width: 120,
          maxWidth: 120,
          textAlign: "center",
        },
        headerStyle: {
          width: 120,
          maxWidth: 120,
        },
      },
      {
        title: "Cliente",
        field: "client_id",
        defaultSort: "asc",
        lookup: { ...Clients },
      },
      {
        title: "Fotografo",
        field: "photographer_id",
        defaultSort: "asc",
        lookup: { ...Photographers },
      },
    ];

  useEffect(() => {
    let date = new Date(),
      year = date.getFullYear(),
      mn = date.getMonth(),
      day = date.getDate(),
      td = new Date(year, mn, day).getDate(),
      tm = new Date(year, mn, day + 1).getDate(),
      today = td < 10 ? `0${td}` : td,
      tomorrow = tm < 10 ? `0${tm}` : tm,
      month = mn + 1 < 10 ? `0${mn + 1}` : mn + 1;

    setDateToday(`${today}/${month}/${year}`);
    setDateTomorrow(`${tomorrow}/${month}/${year}`);

    handleLoadToday(year, month, today);
    handleLoadTomorrow(year, month, tomorrow);
    handleLoadLookup();
  }, []);

  async function handleLoadLookup() {
    await api.get("/photographer").then((response) => {
      let data = [];

      response.data.map((item) => {
        return (data[item.id] = item.name);
      });

      setPhotographers(data);
    });

    await api.get("/client/active").then((response) => {
      let data = [];

      response.data.map((item) => {
        return (data[item.id] = `${item.name} (${item.broker.name})`);
      });

      setClients(data);
    });
  }

  async function handleLoadToday(year, month, today) {
    await api
      .get(`/scheduling/day/${year}-${month}-${today}`)
      .then((response) => {
        setToday(response.data);
      });
  }

  async function handleLoadTomorrow(year, month, tomorrow) {
    await api
      .get(`/scheduling/day/${year}-${month}-${tomorrow}`)
      .then((response) => {
        setTomorrow(response.data);
      });
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item sm={6} xs={12}>
          <Paper className={classes.paper}>
            <MaterialTable
              title={`Agendamentos de hoje (${dateToday})`}
              columns={columns}
              data={today}
              localization={{
                body: {
                  emptyDataSourceMessage: "Sem registros para mostrar",
                },
                header: {
                  actions: "",
                },
                toolbar: {
                  searchTooltip: "Pesquisar",
                  searchPlaceholder: "Pesquisar",
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
                  lastTooltip: "Última Página",
                },
              }}
              options={{
                search: false,
              }}
            />
          </Paper>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Paper className={classes.paper}>
            <MaterialTable
              title={`Agendamentos de amanhã (${dateTomorrow})`}
              columns={columns}
              data={tomorrow}
              localization={{
                body: {
                  emptyDataSourceMessage: "Sem registros para mostrar",
                },
                header: {
                  actions: "",
                },
                toolbar: {
                  searchTooltip: "Pesquisar",
                  searchPlaceholder: "Pesquisar",
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
                  lastTooltip: "Última Página",
                },
              }}
              options={{
                search: false,
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default withSnackbar(Home);
