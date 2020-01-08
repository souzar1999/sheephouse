import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles({
  container: {
    paddingTop: "50px",
    height: "100vh",
    textAlign: "center",
    display: "flex",
    margin: "auto",
    justifyContent: "center"
  }
});

const Container = ({ children }) => {
  const classes = useStyles();

  return <Box className={classes.container}>{children}</Box>;
};

export default Container;
