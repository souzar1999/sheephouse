import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

import api from "../../services/api";

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

const Container = ({ children, isUserAdmin, isUserLogged }) => {
  const classes = useStyles();

  const [maintenance, setMaintenance] = useState({});
  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    await api.get("/configuration/1").then((response) => {
      setMaintenance(response.data[0].maintenance);
    });
  }

  if (maintenance && !isUserAdmin && isUserLogged) {
    return (
      <Box className={classes.container}>
        <h2
          style={{
            marginTop: "120px",
            padding: "40px",
            backgroundColor: "#fff",
            borderRadius: "4px",
          }}
        >
          Sistema está em manutenção! <br />
          <br />
          Volte em breve...
        </h2>
      </Box>
    );
  } else {
    return <Box className={classes.container}>{children}</Box>;
  }
};

const mapStateToProps = (state) => ({
  isUserAdmin: state.isUserAdmin,
  isUserLogged: state.isUserLogged,
});

export default connect(mapStateToProps, {})(Container);
