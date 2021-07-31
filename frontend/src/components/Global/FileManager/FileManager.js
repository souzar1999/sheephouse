import React, { useEffect, useState } from "react";
import { withSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
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
    padding: theme.spacing(1, 1),
  },
}));

function FileDownloader({ enqueueSnackbar, clientCode }) {
  const classes = useStyles();

  const { id } = useParams();
  const [photo_link, setPhotoLink] = useState("");
  const [video_link, setVideoLink] = useState("");
  const [tour_link, setTourLink] = useState("");

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    await api.get("/scheduling/" + id).then((response) => {
      setPhotoLink(response.data.photo_link);
      setVideoLink(response.data.video_link);
      setTourLink(response.data.tour_link);
    });
  }

  async function handleUploadLinks() {
    await api
      .put(`/scheduling/${id}`, {
        photo_link,
        tour_link,
        video_link,
      })
      .then(async (response) => {
        await api
          .get("/scheduling/" + id + "/complete")
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
        <Grid container item xs={12}>
          <Grid item xs={4} className={classes.submit}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => history.push(`/scheduling`)}
            >
              Voltar
            </Button>
          </Grid>
          <Grid item xs={8} className={classes.submit}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                handleUploadLinks();
              }}
            >
              Salvar
            </Button>
          </Grid>
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
