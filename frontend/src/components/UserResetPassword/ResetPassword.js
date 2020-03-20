import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withSnackbar } from "notistack";

import history from "../../history";
import api from "../../services/api";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(6),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function ResetPassword({ enqueueSnackbar }) {
  const classes = useStyles(),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [password2, setPassword2] = useState(""),
    queryString = window.location.search,
    urlParams = new URLSearchParams(queryString),
    token = urlParams.get("token");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email) {
      enqueueSnackbar("Informe o email!", {
        variant: "error",
        autoHideDuration: 5000,
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
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!password) {
      enqueueSnackbar("Informe a senha para prosseguir!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!password2) {
      enqueueSnackbar("Informe a senha novamente para prosseguir!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (password !== password2) {
      enqueueSnackbar("As senhas não conferem!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    await api
      .post("/resetPassword", { email, password, token })
      .then(async response => {
        enqueueSnackbar("Senha alterada com sucesso!", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });

        history.push("/");
      })
      .catch(error => {
        enqueueSnackbar("Problemas ao trocar a senha!", {
          variant: "error",
          autoHideDuration: 5000,
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
          <img src="./assets/logo.png" alt="Sheep House" height={100} />
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Senha Novamente"
            type="password"
            id="password2"
            autoComplete="current-password"
            value={password2}
            onChange={event => setPassword2(event.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Trocar Senha
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default withSnackbar(ResetPassword);
