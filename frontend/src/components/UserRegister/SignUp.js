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
    marginTop: theme.spacing(-7),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(1),
    },
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignUp({ enqueueSnackbar }) {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [termsOfUse, setTermsOfUse] = useState(false);

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

    if (!password2) {
      enqueueSnackbar("Informe a senha novamente para prosseguir!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (password !== password2) {
      enqueueSnackbar("As senhas não conferem!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!termsOfUse) {
      enqueueSnackbar("Aceite os termos de uso para prosseguir!", {
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
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          <img src="./assets/logo.png" alt="Sheep House" height={100} />
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
                onChange={(event) => setName(event.target.value)}
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
                onChange={(event) => {
                  setEmail(event.target.value);
                  setUsername(event.target.value);
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
                onChange={(event) => setPhone(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password2"
                label="Repita a Senha"
                type="password"
                id="password2"
                value={password2}
                onChange={(event) => setPassword2(event.target.value)}
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    required
                    value={termsOfUse}
                    onClick={(event) => setTermsOfUse(event.target.value)}
                    color="primary"
                  />
                }
                label="Eu li e concordo com os termos de uso"
              />
              <small style={{ float: "left", fontStyle: "italic" }}>
                Clique aqui para ver os{" "}
                <Link
                  target="_blank"
                  to="./assets/termos-de-uso-sheephouse.pdf"
                >
                  termos
                </Link>
              </small>
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
          <Grid container justify="center">
            <LinkMaterial component={Link} to="/" variant="body2">
              {"Já possui uma conta? Faça Login!"}
            </LinkMaterial>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default withSnackbar(SignUp);
