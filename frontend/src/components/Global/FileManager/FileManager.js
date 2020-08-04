import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import { useParams } from "react-router-dom";
import { compose } from "redux";

import { connect } from "react-redux";

import api from "../../../services/api";
import history from "../../../history";

const useStyles = makeStyles((theme) => ({
  main: {
    [theme.breakpoints.down("sm")]: {
      maxWidth: 375,
      marginTop: theme.spacing(8),
    },
  },
  button: {
    backgroundColor: "#43a047",
    color: "white",
    "&:hover": {
      backgroundColor: "green",
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function FileDownloader({ enqueueSnackbar, clientCode }) {
  const classes = useStyles();

  const { uploadType, folderName, dbCode } = useParams();
  const [files, setFiles] = useState([]);
  const columns = [{ title: "Nome", field: "Key", defaultSort: "asc" }];
  const [photographers, setPhotographers] = useState([]);
  const [photographer_id, setPhotographerId] = useState("");

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    await api
      .get("/storages/storage/" + uploadType + "/folder/" + folderName)
      .then((response) => {
        setFiles(response.data.result);
      });

    await api.get("/photographer").then((response) => {
      setPhotographers(response.data);
    });
  }

  async function deleteFile(rowData) {
    await api
      .delete(
        "/storages/storage/" +
          uploadType +
          "/folder/" +
          folderName +
          "/" +
          rowData.Key +
          "/delete"
      )
      .then((response) => {
        enqueueSnackbar("Arquivo Removido com sucesso!", {
          variant: "success",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
        const index = files.indexOf(rowData);
        if (index > -1) {
          files.splice(index, 1);
        }
        setFiles(files);
      });
  }

  async function downlaodZipFile() {
    var responseZip = await api.get(
      "/storages/storage/" + uploadType + "/folder/" + folderName + "/zip"
    );

    window.open(
      "https://zipper.sheephouse.com.br" + "/?ref=" + responseZip.data.result,
      "_blank"
    );
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

  return (
    <>
      <div className={classes.main}>
        <MaterialTable
          title="Gerenciador de arquivos"
          actions={[
            (rowData) => ({
              icon: "delete",
              tooltip: "Excluir",
              onClick: (event, rowData) => {
                deleteFile(rowData);
              },
              hidden: clientCode,
            }),
            {
              icon: "cloud_upload",
              tooltip: "Upload",
              isFreeAction: true,
              onClick: () => {
                history.push(
                  "/fileuploader/" +
                    uploadType +
                    "/" +
                    folderName +
                    "/" +
                    dbCode
                );
              },
              hidden: clientCode,
            },
            {
              icon: "cloud_download",
              tooltip: "Download",
              isFreeAction: true,
              onClick: () => {
                downlaodZipFile();
              },
            },
            {
              icon: "arrow_back",
              tooltip: "Voltar",
              isFreeAction: true,
              onClick: () => {
                history.push("/scheduling");
              },
            },
          ]}
          columns={columns}
          data={files}
          localization={{
            body: {
              filterRow: {
                filterTooltip: "Filtro",
              },
              emptyDataSourceMessage: "Sem registros para mostrar",
            },
            header: {
              actions: "",
            },
            toolbar: {
              searchTooltip: "Pesquisar",
              searchPlaceholder: "Pesquisar",
            },
            pagination: {
              labelRowsSelect: "Registros",
              labelRowsPerPage: "Registros por página",
              firstAriaLabel: "Primeira Página",
              firstTooltip: "Primeira Página",
              previousAriaLabel: "Página Anterior",
              previousTooltip: "Página Anterior",
              nextAriaLabel: "Página Seguinte",
              nextTooltip: "Página Seguinte",
              lastAriaLabel: "Última Página",
              lastTooltip: "Última Página",
            },
          }}
          options={{
            search: false,
            pageSize: 5,
            filtering: true,
          }}
        />
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
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  clientCode: state.clientCode,
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(FileDownloader);
