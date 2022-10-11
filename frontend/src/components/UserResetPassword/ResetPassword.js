import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withSnackbar } from "notistack";

import history from "../../history";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "40px",
    backgroundColor: "rgba(255, 255, 255, .75)",
    boxShadow: 'none'
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  submit: {
    width: "50%",
    margin: theme.spacing(3, 0, 2),
    textTransform: 'none',
    backgroundColor: '#051673'
  },
  container: {
    marginRight: "unset",
  },
  logo: {
    position: "absolute",
    top: "31px",
    left: "24px",
    display: "block",
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
  },
  logoPaper: {
    position: "relative",
    display: "none",
    marginBottom: theme.spacing(8),
    [theme.breakpoints.down("sm")]: {
      display: "block"
    },
  },
  input: {
    borderRadius: "9px",
    marginTop: theme.spacing(1),
    '& .MuiOutlinedInput-root': {
      borderRadius: "9px",
      '& .MuiOutlinedInput-input': {
        borderRadius: "9px",
      },
    },
  },
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
    <>
      <img src="./assets/sheephouse.png" alt="Sheep House" height={60} className={classes.logo}/>
      <Container component="main" maxWidth="xs" className={classes.container}>
        <Paper className={classes.paper}
          direction="row"
          justifyContent="center"
          alignItems="center">
          <Grid 
            container
            justifyContent="space-between"
          >
            <Grid item>
              <img src="./assets/sheephouse.png" alt="Sheep House" height={60} className={classes.logoPaper}/>
              <Typography component="h6" variant="caption" align="left">
                Seja Bem Vindo
              </Typography>
              <Typography component="h6" variant="h3" align="left">
                Redefinir a senha
              </Typography>
            </Grid>
          </Grid>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <Typography component="caption" variant="caption" align="left" style={{whiteSpace: 'nowrap', color: '#000', fontSize: '.9rem'}}>
              Insira seu Email
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
            <Typography component="caption" variant="caption" align="left" style={{whiteSpace: 'nowrap', color: '#000', fontSize: '.9rem'}}>
              Insira sua Nova Senha
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
            <Typography component="caption" variant="caption" align="left" style={{whiteSpace: 'nowrap', color: '#000', fontSize: '.9rem'}}>
              Insira sua Nova Senha Novamente
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password2"
              type="password"
              id="password2"
              autoComplete="current-password"
              value={password2}
              onChange={event => setPassword2(event.target.value)}
            />
            <Grid container style={{width: '100%', justifyContent: "end" }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Trocar Senha
              </Button>
            </Grid>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default withSnackbar(ResetPassword);
