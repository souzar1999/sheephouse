import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import { Link as LinkMaterial } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { withSnackbar } from "notistack";
import { Link } from "react-router-dom";

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
      marginTop: theme.spacing(4),
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

function SignUp({ enqueueSnackbar }) {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name) {
      enqueueSnackbar("Informe o nome!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!email) {
      enqueueSnackbar("Informe o email para prosseguir!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!phone) {
      enqueueSnackbar("Informe o telefone!", {
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
      enqueueSnackbar("Informe a senha para prosseguir!", {
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
      .post("/users", { username, email, password })
      .then(async (response) => {
        const user_id = response.data.id,
          actived = false;
        await api
          .post("/client", { name, phone, user_id, actived })
          .then((response) => {
            enqueueSnackbar("Obrigado pelo seu cadastro!", {
              variant: "success",
              autoHideDuration: 5000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center",
              },
            });

            enqueueSnackbar("Iremos ativar o seu cadastro em breve!", {
              variant: "success",
              autoHideDuration: 5000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center",
              },
            });

            history.push("/");
          });
      })
      .catch((error) => {
        enqueueSnackbar("Problemas ao cadastrar usuário!", {
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
                Cadastro
              </Typography>
            </Grid>
            <Grid item style={{whiteSpace: 'nowrap'}}>
              <Typography component="caption" variant="caption" align="left" style={{fontSize: '.6rem'}}>
                Já possui uma conta?
                <br/>
                <LinkMaterial component={Link} to="/" variant="body2" style={{fontSize: '.6rem'}}>
                  Entrar
                </LinkMaterial>
              </Typography>
            </Grid>
          </Grid>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <Typography component="caption" variant="caption" align="left" style={{whiteSpace: 'nowrap', color: '#000', fontSize: '.9rem'}}>
                    Insira seu Email
                </Typography>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                    setEmail(event.target.value);
                    setUsername(event.target.value);
                    }}
                />
                </Grid>
                <Grid item xs={6}>
                <Typography component="caption" variant="caption" align="left" style={{whiteSpace: 'nowrap', color: '#000', fontSize: '.9rem'}}>
                    Nome
                </Typography>
                <TextField
                    autoComplete="name"
                    name="userName"
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    autoFocus
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                </Grid>
                <Grid item xs={6}>
                <Typography component="caption" variant="caption" align="left" style={{whiteSpace: 'nowrap', color: '#000', fontSize: '.9rem'}}>
                    Telefone
                </Typography>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="phone"
                    name="phone"
                    autoComplete="phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <Typography component="caption" variant="caption" align="left" style={{whiteSpace: 'nowrap', color: '#000', fontSize: '.9rem'}}>
                    Cadastre uma Senha
                </Typography>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                </Grid>
            </Grid>
            <Grid container style={{width: '100%',  marginTop: '5px', marginBottom: '10px', justifyContent: "end" }}>
              <small style={{ float: "left", fontStyle: "italic" }}>
                <Link
                  target="_blank"
                  to="./assets/termos-de-uso-sheephouse.pdf"
                >
                  Termos
                </Link>
                {" "} de uso
              </small>
            </Grid>
            <Grid container style={{width: '100%', marginBottom: '10px', justifyContent: "end" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Cadastrar
              </Button>
            </Grid>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default withSnackbar(SignUp);
