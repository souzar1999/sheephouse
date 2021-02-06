import React, { useEffect, useState } from "react";
import { withSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { useParams } from "react-router-dom";

import history from "../../../history";
import api from "../../../services/api";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    minWidth: "300px",
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  grid: {
    marginBottom: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Horary({ enqueueSnackbar }) {
  const { photographer_id } = useParams();
  const classes = useStyles();
  const [segunda, setSegunda] = useState([]);
  const [terca, setTerca] = useState([]);
  const [quarta, setQuarta] = useState([]);
  const [quinta, setQuinta] = useState([]);
  const [sexta, setSexta] = useState([]);
  const [sabado, setSabado] = useState([]);
  const [domingo, setDomingo] = useState([]);
  const [time, setTime] = useState();
  const [dia_semana, setDiaSemana] = useState();
  const [maior, setMaior] = useState([]);

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    await api
      .get("/horary", { params: { photographer_id } })
      .then((response) => {
        const dia1 = response.data.filter((horary) => horary.dia_semana === 1);
        const dia2 = response.data.filter((horary) => horary.dia_semana === 2);
        const dia3 = response.data.filter((horary) => horary.dia_semana === 3);
        const dia4 = response.data.filter((horary) => horary.dia_semana === 4);
        const dia5 = response.data.filter((horary) => horary.dia_semana === 5);
        const dia6 = response.data.filter((horary) => horary.dia_semana === 6);
        const dia0 = response.data.filter((horary) => horary.dia_semana === 0);

        console.log(dia1);
        console.log(dia2);
        console.log(dia3);
        console.log(dia4);
        console.log(dia5);
        console.log(dia6);
        console.log(dia0);

        let maiorDia = [];

        if (
          dia1.length >= dia2.length &&
          dia1.length >= dia3.length &&
          dia1.length >= dia4.length &&
          dia1.length >= dia5.length &&
          dia1.length >= dia6.length &&
          dia1.length >= dia0.length
        ) {
          maiorDia = dia1;
        } else if (
          dia2.length >= dia1.length &&
          dia2.length >= dia3.length &&
          dia2.length >= dia4.length &&
          dia2.length >= dia5.length &&
          dia2.length >= dia6.length &&
          dia2.length >= dia0.length
        ) {
          maiorDia = dia2;
        } else if (
          dia3.length >= dia1.length &&
          dia3.length >= dia2.length &&
          dia3.length >= dia4.length &&
          dia3.length >= dia5.length &&
          dia3.length >= dia6.length &&
          dia3.length >= dia0.length
        ) {
          maiorDia = dia3;
        } else if (
          dia4.length >= dia1.length &&
          dia4.length >= dia3.length &&
          dia4.length >= dia2.length &&
          dia4.length >= dia5.length &&
          dia4.length >= dia6.length &&
          dia4.length >= dia0.length
        ) {
          maiorDia = dia4;
        } else if (
          dia5.length >= dia1.length &&
          dia5.length >= dia3.length &&
          dia5.length >= dia4.length &&
          dia5.length >= dia2.length &&
          dia5.length >= dia6.length &&
          dia5.length >= dia0.length
        ) {
          maiorDia = dia5;
        } else if (
          dia6.length >= dia1.length &&
          dia6.length >= dia3.length &&
          dia6.length >= dia4.length &&
          dia6.length >= dia5.length &&
          dia6.length >= dia2.length &&
          dia6.length >= dia0.length
        ) {
          maiorDia = dia6;
        } else if (
          dia0.length >= dia1.length &&
          dia0.length >= dia3.length &&
          dia0.length >= dia4.length &&
          dia0.length >= dia5.length &&
          dia0.length >= dia6.length &&
          dia0.length >= dia2.length
        ) {
          maiorDia = dia0;
        }

        setMaior(maiorDia);

        setSegunda(dia1);
        setTerca(dia2);
        setQuarta(dia3);
        setQuinta(dia4);
        setSexta(dia5);
        setSabado(dia6);
        setDomingo(dia0);
      });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!time) {
      enqueueSnackbar("Informe o horário!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!dia_semana) {
      enqueueSnackbar("Informe o dia da semana!", {
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
      .post(`/horary`, { time, dia_semana, photographer_id })
      .then((response) => {
        enqueueSnackbar("Horário cadastrado com sucesso!", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });

        handleLoad();
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao cadastrar horário!", {
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
      <Paper>
        <Table aria-label="Horários">
          <TableHead>
            <TableRow>
              <TableCell>Segunda-feira</TableCell>
              <TableCell>Terça-feira</TableCell>
              <TableCell>Quarta-feira</TableCell>
              <TableCell>Quinta-feira</TableCell>
              <TableCell>Sexta-feira</TableCell>
              <TableCell>Sábado</TableCell>
              <TableCell>Domingo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {maior.map((element, index) => {
              return (
                <TableRow>
                  <TableCell align="center">
                    {segunda[index] ? segunda[index].time : ""}
                  </TableCell>
                  <TableCell align="center">
                    {terca[index] ? terca[index].time : ""}
                  </TableCell>
                  <TableCell align="center">
                    {quarta[index] ? quarta[index].time : ""}
                  </TableCell>
                  <TableCell align="center">
                    {quinta[index] ? quinta[index].time : ""}
                  </TableCell>
                  <TableCell align="center">
                    {sexta[index] ? sexta[index].time : ""}
                  </TableCell>
                  <TableCell align="center">
                    {sabado[index] ? sabado[index].time : ""}
                  </TableCell>
                  <TableCell align="center">
                    {domingo[index] ? domingo[index].time : ""}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
      <Paper className={classes.paper}>
        <Typography className={classes.title} component="h5" variant="h5">
          Adicionar Horário
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid className={classes.grid} item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <TextField
                id="time"
                label="Horário"
                value={time}
                type="time"
                onChange={(event) => {
                  setTime(event.target.value);
                }}
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid className={classes.grid} item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <TextField
                id="dia_semana"
                select
                label="Dia da Semana"
                value={dia_semana}
                onChange={(event) => {
                  setDiaSemana(event.target.value);
                }}
                variant="outlined"
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="1">Segunda-feira</MenuItem>
                <MenuItem value="2">Terça-feira</MenuItem>
                <MenuItem value="3">Quarta-feira</MenuItem>
                <MenuItem value="4">Quinta-feira</MenuItem>
                <MenuItem value="5">Sexta-feira</MenuItem>
                <MenuItem value="6">Sábado</MenuItem>
                <MenuItem value="0">Domingo</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="small"
              className={classes.submit}
            >
              Adicionar
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => {
                history.push("/admin/photographer");
              }}
            >
              Voltar
            </Button>
          </Grid>
        </form>
      </Paper>
    </>
  );
}

export default withSnackbar(Horary);
