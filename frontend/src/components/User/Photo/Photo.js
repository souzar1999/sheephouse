import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Scheduling from "./Scheduling";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column"
  }
}));

function Photo({ enqueueSnackbar, google }) {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography component="h2" variant="h4">
        Agende a sessão de fotos
      </Typography>
      <Scheduling />
    </Paper>
  );
}

export default Photo;
