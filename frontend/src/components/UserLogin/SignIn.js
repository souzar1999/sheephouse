import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import { Link as LinkMaterial } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withSnackbar } from "notistack";
import { compose } from "redux";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { userLogin, userClient, userAdmin } from "../../store/actions";

import api from "../../services/api";
import history from "../../history";

import LocalStorage from "../../services/localStorage.js";
const localStorageJs = LocalStorage.getService();

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
    marginTop: theme.spacing(10),
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

function SignIn({ enqueueSnackbar, onUserLogin, onUserClient, onUserAdmin }) {
  const classes = useStyles(),
    [email, setEmail] = useState(localStorage.getItem("userEmail")),
    [password, setPassword] = useState(localStorage.getItem("userPass"));
  useEffect(() => {
    if (email && password) {
      handleSubmit();
    }
  }, []);

  async function handleSubmit(event) {
    if (event) event.preventDefault();

    if (!email) {
      enqueueSnackbar("Informe o email!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      enqueueSnackbar("Informe um email válido para prosseguir!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!password) {
      enqueueSnackbar("Informe a senha!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    await api
      .post("/sessions", { email, password })
      .then(async (response) => {
        localStorageJs.setToken(response.data);

        await api
          .get("/user", {
            headers: { Authorization: `Bearer ${response.data.token}` },
          })
          .then(async (response) => {
            if (response.data.admin) {
              onUserAdmin();
              onUserLogin();

              enqueueSnackbar(`Seja bem vindo!`, {
                variant: "success",
                autoHideDuration: 5000,
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "center",
                },
              });

              localStorage.setItem("userEmail", email);
              localStorage.setItem("userPass", password);

              history.push("/admin/home");

              return;
            }

            await api
              .get(`/client/user/${response.data.id}`)
              .then((response) => {
                if (response.data[0]) {
                  if (response.data[0].id) {
                    onUserClient(response.data[0].id);
                    onUserLogin();

                    enqueueSnackbar(
                      `Seja bem vindo ${response.data[0].name}!`,
                      {
                        variant: "success",
                        autoHideDuration: 5000,
                        anchorOrigin: {
                          vertical: "top",
                          horizontal: "center",
                        },
                      }
                    );

                    history.push("/home");

                    return;
                  }
                } else {
                  enqueueSnackbar(
                    "Obrigado pelo seu cadastro.\nIremos ativar o seu cadastro em breve!",
                    {
                      variant: "error",
                      autoHideDuration: 5000,
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "center",
                      },
                    }
                  );
                }
              });
          });
      })
      .catch((error) => {
        enqueueSnackbar(
          "Email e senha informados não correspondem a nenhum usuário!",
          {
            variant: "error",
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
          }
        );
      });
  }

  async function handleForgotPassword() {
    if (!email) {
      enqueueSnackbar("Informe o email!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      enqueueSnackbar("Informe um email válido para prosseguir!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    await api
      .post("/forgotPassword", { email })
      .then(async (response) => {
        enqueueSnackbar(
          "Acesse seu email para trocar a senha!\nVerifique a caixa de SPAM.",
          {
            variant: "success",
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
          }
        );
      })
      .catch((error) => {
        enqueueSnackbar("Problemas ao enviar email de troca de senha!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      });
  }

  return (
    <>
      <img src="/assets/sheephouse.png" alt="Sheep House" height={60} className={classes.logo}/>
      <Container component="main" maxWidth="xs" className={classes.container}>
        <Paper 
          className={classes.paper} 
          direction="row"
          justifyContent="center"
          alignItems="center">
          <Grid 
            container
            justifyContent="space-between"
          >
            <Grid item>
              <img src="/assets/sheephouse.png" alt="Sheep House" height={60} className={classes.logoPaper}/>
              <Typography component="h6" variant="caption" align="left">
                Seja Bem Vindo
              </Typography>
              <Typography component="h6" variant="h3" align="left">
                Entrar
              </Typography>
            </Grid>
            <Grid item style={{whiteSpace: 'nowrap'}}>
              <Typography component="caption" variant="caption" align="left" style={{fontSize: '.6rem'}}>
                Não possui conta?
                <br/>
                <LinkMaterial component={Link} to="/signup" variant="body2" style={{fontSize: '.6rem'}}>
                  Cadastrar
                </LinkMaterial>
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
              className={classes.input} 
              onChange={(event) => setEmail(event.target.value)}
            />
            <Typography component="caption" variant="caption" align="left" style={{whiteSpace: 'nowrap', color: '#000', fontSize: '.9rem', marginTop: '20px'}}>
              Insira sua Senha
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
              className={classes.input} 
              onChange={(event) => setPassword(event.target.value)}
            />
            <Grid container style={{width: '100%', marginBottom: '10px', justifyContent: "end" }}>
              <LinkMaterial onClick={handleForgotPassword} variant="body2" style={{fontSize: '.6rem'}}>
                Esqueci minha senha
              </LinkMaterial>
            </Grid>
            <Grid container style={{width: '100%', marginBottom: '10px', justifyContent: "end" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Entrar
              </Button>
            </Grid>
          </form>
        </Paper>
      </Container>
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUserLogin: () => {
      dispatch(userLogin());
    },
    onUserClient: (id) => {
      dispatch(userClient(id));
    },
    onUserAdmin: () => {
      dispatch(userAdmin());
    },
  };
};

const withConnect = connect(null, mapDispatchToProps);

export default compose(withSnackbar, withConnect)(SignIn);
