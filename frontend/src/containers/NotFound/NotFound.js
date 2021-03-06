import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
  image: {
    marginTop: theme.spacing(8),
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "400px",
    maxHeight: "250px",
    height: "100%",
    borderRadius: "10px"
  }
}));

function NotFound() {
  const classes = useStyles();
  return <img className={classes.image} src="/assets/404.jpg" />;
}

export default NotFound;
