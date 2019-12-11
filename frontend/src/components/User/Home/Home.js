import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up("xs")]: {
      height: "60vh",
      justifyContent: "center",
      alignItems: "center"
    },
    [theme.breakpoints.down("xs")]: {
      height: "auto",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "stretch"
    }
  },
  paperFoto: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url("./assets/camera.jpg")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    [theme.breakpoints.up("sm")]: {
      height: 400,
      width: 400
    },
    [theme.breakpoints.down("sm")]: {
      height: 300,
      width: 300
    },
    [theme.breakpoints.down("xs")]: {
      height: 200,
      width: 200
    }
  },
  paperDrone: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url("./assets/drone.jpg")`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    [theme.breakpoints.up("sm")]: {
      height: 400,
      width: 400
    },
    [theme.breakpoints.down("sm")]: {
      height: 300,
      width: 300
    },
    [theme.breakpoints.down("xs")]: {
      height: 200,
      width: 200
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
    <>
      <Typography className={classes.title} component="h1" variant="h3">
        Selecione uma das opções
      </Typography>
      <Typography className={classes.title} component="h1" variant="h3">
        para agendar a sessão
      </Typography>
      <div>
        <Grid container className={classes.root} spacing={5}>
          <Grid item sm={6} xs={12}>
            <Paper
              component={Link}
              to="/scheduling/photo"
              className={classes.paperFoto}
            ></Paper>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Paper
              component={Link}
              to="/scheduling/drone"
              className={classes.paperDrone}
            ></Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Home;
