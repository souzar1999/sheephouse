import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles({
  container: {
    paddingTop: "100px",
    maxWidth: "800px",
    height: "100vh",
    textAlign: "center"
  }
});

const Container = ({ children }) => {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      margin="auto"
      justifyContent="center"
      className={classes.container}
    >
      {children}
    </Box>
  );
};

export default Container;
