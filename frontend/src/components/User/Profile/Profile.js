import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";

import api from "../../../services/api";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(1)
    }
  },
  title: {
    marginBottom: theme.spacing(4)
  }
}));

function Profile({ enqueueSnackbar, clientCode }) {
  const classes = useStyles();

  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [phone, setPhone] = useState(""),
    [client, setClient] = useState([]);

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    await api.get(`/client/${clientCode}`).then(response => {
      setName(response.data[0].name);
      setEmail(response.data[0].user.email);
      setPhone(response.data[0].phone);
      setClient(response.data[0]);
    });
  }

  async function handleForgotPassword() {
    await api
      .post("/forgotPassword", { email: client.user.email })
      .then(async response => {
        enqueueSnackbar("Acesse seu email para trocar a senha!", {
          variant: "success",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      })
      .catch(error => {
        enqueueSnackbar("Problemas ao enviar email de troca de senha!", {
          variant: "error",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
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

    if (!email) {
      enqueueSnackbar("Informe o email para prosseguir!", {
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

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      enqueueSnackbar("Informe um email válido para prosseguir!", {
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
      .put(`/client/${clientCode}`, { name, phone, email })
      .then(response => {
        enqueueSnackbar("Informações alteradas com sucesso!", {
          variant: "success",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      })
      .catch(error => {
        enqueueSnackbar("Problemas alterar informações!", {
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
        <Typography className={classes.title} component="h1" variant="h5">
          Edite seus dados
        </Typography>
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
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={event => {
                setEmail(event.target.value);
              }}
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Editar
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleForgotPassword}
            >
              Alterar a senha
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

const mapStateToProps = state => ({
  clientCode: state.clientCode
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(Profile);
