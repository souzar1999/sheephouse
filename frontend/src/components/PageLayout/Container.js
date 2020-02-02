import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
  container: {
    width: "940px",
    height: "100vh",
    textAlign: "center",
    display: "flex",
    margin: "auto",
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      paddingTop: "70px"
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  }
}));

const Container = ({ children }) => {
  const classes = useStyles();

  return <Box className={classes.container}>{children}</Box>;
};

export default Container;
