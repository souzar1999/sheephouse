import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import { useParams } from "react-router-dom";
import { compose } from "redux";

import { connect } from "react-redux";

import api from "../../../services/api";
import history from "../../../history";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
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

function FileDownloader({ enqueueSnackbar, clientCode }) {
  const classes = useStyles();

  const { uploadType, folderName, dbCode } = useParams();
  const [photographers, setPhotographers] = useState([]);
  const [photographer_id, setPhotographerId] = useState("");
  const [photo_link, setPhotoLink] = useState("");
  const [video_link, setVideoLink] = useState("");
  const [tour_link, setTourLink] = useState("");

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    await api.get("/scheduling/" + dbCode).then((response) => {
      setPhotoLink(response.data.photo_link);
      setVideoLink(response.data.video_link);
      setTourLink(response.data.tour_link);
    });

    await api.get("/photographer").then((response) => {
      setPhotographers(response.data);
    });
  }

  async function handleChangePhotographer() {
    await api
      .put(`/scheduling/${dbCode}`, {
        photographer_id,
      })
      .then((response) => {
        enqueueSnackbar("Fotógrafo alterado com sucesso", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao cadastrar registro!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      });
  }

  async function handleUploadLinks() {
    await api
      .put(`/scheduling/${dbCode}`, {
        photo_link,
        tour_link,
        video_link,
      })
      .then(async (response) => {
        await api
          .get("/scheduling/" + dbCode + "/complete")
          .then(async (response) => {
            enqueueSnackbar("Sessão finalizada", {
              variant: "success",
              autoHideDuration: 5000,
              anchorOrigin: {
                vertical: "top",
                horizontal: "center",
              },
            });
          });
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao adicioanr links!", {
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
      <Paper className={classes.paper}>
        <Typography className={classes.title} component="h5" variant="h5">
          Adicionar links
        </Typography>
        <Grid className={classes.grid} item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="photoLink"
              label="Fotos"
              name="photoLink"
              autoComplete="photoLink"
              value={photo_link}
              onChange={(event) => {
                setPhotoLink(event.target.value);
              }}
            />
          </FormControl>
        </Grid>
        <Grid className={classes.grid} item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="videoLink"
              label="Vídeos"
              name="videoLink"
              autoComplete="videoLink"
              value={video_link}
              onChange={(event) => {
                setVideoLink(event.target.value);
              }}
            />
          </FormControl>
        </Grid>
        <Grid className={classes.grid} item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="tourLink"
              label="Tour 360°"
              name="tourLink"
              autoComplete="tourLink"
              value={tour_link}
              onChange={(event) => {
                setTourLink(event.target.value);
              }}
            />
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
            onClick={() => {
              handleUploadLinks();
            }}
          >
            Salvar
          </Button>
        </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <Typography className={classes.title} component="h5" variant="h5">
          Altere o fotógrafo
        </Typography>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <Select
              id="photographerSelect"
              value={photographer_id}
              onChange={(event) => {
                setPhotographerId(event.target.value);
              }}
            >
              <MenuItem value="">-- Selecione --</MenuItem>
              {photographers.map((item) => {
                return (
                  <MenuItem id={item.id} key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
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
            onClick={() => {
              handleChangePhotographer();
            }}
          >
            Salvar
          </Button>
        </Grid>
      </Paper>
    </>
  );
}

const mapStateToProps = (state) => ({
  clientCode: state.clientCode,
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(FileDownloader);
