import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";
import { userClient, userAdmin } from "../../../store/actions";

import history from "../../../history";
import api from "../../../services/api";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function Client({ enqueueSnackbar, onUserClient, onUserAdmin }) {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [broker_id, setBrokerId] = useState("");
  const [user_id, setUserId] = useState("");

  const [brokers, setBrokers] = useState([]);

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  useEffect(() => {
    async function getUserStatus() {
      await api.get("/user").then(async response => {
        if (response.data.admin) {
          onUserAdmin();
          history.push("/admin/home");
          return;
        }

        enqueueSnackbar("Seja bem vindo!", {
          variant: "success",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });

        await api.get(`/client/user/${response.data.id}`).then(response => {
          if (response.data[0]) {
            if (response.data[0].id) {
              onUserClient(response.data[0].id);
              history.push("/home");
            }
          }
        });
      });
    }

    getUserStatus();

    setLabelWidth(inputLabel.current.offsetWidth);

    getBrokers();
    getUser();
  }, [enqueueSnackbar, onUserAdmin, onUserClient]);

  async function getBrokers() {
    await api.get("/broker/active").then(response => {
      setBrokers(response.data);
    });
  }

  async function getUser() {
    await api.get("/user").then(response => {
      setUserId(response.data.id);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name) {
      enqueueSnackbar("Informe o nome!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!phone) {
      enqueueSnackbar("Informe o telefone!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!broker_id) {
      enqueueSnackbar("Selecione a imobiliária!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    await api
      .post("/client", { name, phone, broker_id, user_id })
      .then(response => {
        enqueueSnackbar("Cliente cadastrado!", {
          variant: "success",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });

        onUserClient(response.data.id);
        history.push("/home");
      })
      .catch(error => {
        enqueueSnackbar("Problemas ao cadastrar cliente!", {
          variant: "error",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      });
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          Por favor, complete o seu cadastro de corretor para continuar.
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="userName"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Nome"
                autoFocus
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="phone"
                label="Telefone (xx)xxxxx-xxxx"
                name="phone"
                autoComplete="phone"
                value={phone}
                onChange={event => setPhone(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel ref={inputLabel} id="brokerSelect">
                  Imobiliárias
                </InputLabel>
                <Select
                  id="brokerSelect"
                  labelWidth={labelWidth}
                  value={broker_id}
                  onChange={event => setBrokerId(event.target.value)}
                >
                  {brokers.map(item => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Cadastrar
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    onUserClient: id => {
      dispatch(userClient(id));
    },
    onUserAdmin: () => {
      dispatch(userAdmin());
    }
  };
};

const withConnect = connect(null, mapDispatchToProps);

export default compose(withSnackbar, withConnect)(Client);
