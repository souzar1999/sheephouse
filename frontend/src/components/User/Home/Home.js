import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

import history from "../../../history";
import api from "../../../services/api";

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up("xs")]: {
      height: "60vh",
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing(2)
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
    [theme.breakpoints.down("xs")]: {
      height: "auto",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "stretch"
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },
  paperAgendamento: {
    display: "inline-block",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url("./assets/agendamento.png")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    [theme.breakpoints.up("sm")]: {
      height: 350,
      width: 350
    },
    [theme.breakpoints.down("sm")]: {
      height: 250,
      width: 250
    }
  },
  title: {
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  }
}));

function Home() {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography className={classes.title} component="h1" variant="h3">
        Clique aqui para agendar a sessão
      </Typography>
      <Grid container className={classes.root} spacing={5}>
        <Grid item sm={12} xs={12}>
          <Paper
            component={Link}
            to="/scheduling/photo"
            className={classes.paperAgendamento}
          ></Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Home;
