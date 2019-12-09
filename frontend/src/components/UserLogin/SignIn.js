import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";
import { userLogin } from "../../store/actions";

import api from "../../services/api";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
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

function SignIn({ enqueueSnackbar, onUserLogin }) {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email) {
      enqueueSnackbar("Informe o email!", {
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

    if (!password) {
      enqueueSnackbar("Informe a senha!", {
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
      .post("/sessions", { email, password })
      .then(response => {
        enqueueSnackbar("Seja bem vindo!", {
          variant: "success",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });

        onUserLogin(response.data.token, response.data.refreshToken);
      })
      .catch(error => {
        enqueueSnackbar(
          "Email e senha informados não correspondem a nenhum usuário!",
          {
            variant: "error",
            autoHideDuration: 2500,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center"
            }
          }
        );
      });
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          <img src="./assets/logo.webp" alt="Sheephouse" height={100} />
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Entrar
          </Button>
          <Grid container justify="center">
            <Link href="/signup" variant="body2">
              {"Não possui uma conta? Cadastre-se!"}
            </Link>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    onUserLogin: (userToken, refreshToken) => {
      dispatch(userLogin(userToken, refreshToken));
    }
  };
};

const withConnect = connect(null, mapDispatchToProps);

export default compose(withSnackbar, withConnect)(SignIn);
