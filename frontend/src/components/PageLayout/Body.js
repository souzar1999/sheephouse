import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles({
  body: {
    backgroundImage: `url("/assets/background.jpg")`,
    backgroundPosition: "center",
    backgroundSize: "cover"
  }
});

const Body = ({ children }) => {
  const classes = useStyles();

  return <Box className={classes.body}>{children}</Box>;
};

export default Body;
