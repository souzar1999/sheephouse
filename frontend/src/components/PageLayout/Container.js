import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100vh",
    textAlign: "center",
    display: "flex",
    margin: "auto",
    padding: "0 30px",
    justifyContent: "center",
    alignItems: "flex-start",
    [theme.breakpoints.up("md")]: {
      paddingTop: "70px",
    },
    [theme.breakpoints.down("md")]: {
      width: "100vw",
      padding: "0",
    },
  },
}));

const Container = ({ children }) => {
  const classes = useStyles();

  return <Box className={classes.container}>{children}</Box>;
};

export default Container;
