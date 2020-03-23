import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useParams } from "react-router-dom";
import axios from "axios";
import { compose } from "redux";
import { v4 as uuidv4 } from "uuid";

import { connect } from "react-redux";

import api from "../../../services/api";
import history from "../../../history";

const useStyles = makeStyles(theme => ({
  main: {
    [theme.breakpoints.down("sm")]: {
      maxWidth: 375,
      marginTop: theme.spacing(8)
    }
  },
  button: {
    backgroundColor: "#43a047",
    color: "white",
    "&:hover": {
      backgroundColor: "green"
    }
  },
  imgDialog: {
    [theme.breakpoints.down("sm")]: {
      paddingTop: theme.spacing(8)
    }
  }
}));

function FileDownloader({ enqueueSnackbar, clientCode }) {
  const classes = useStyles();

  const theme = useTheme();
  const FileDownload = require("js-file-download");
  const { uploadType, folderName } = useParams();
  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const columns = [{ title: "Nome", field: "Key", defaultSort: "asc" }];

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    await api
      .get("/storages/storage/" + uploadType + "/folder/" + folderName)
      .then(response => {
        setFiles(response.data.result);
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
      .then(response => {
        enqueueSnackbar("Arquivo Removido com sucesso!", {
          variant: "success",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
        const index = files.indexOf(rowData);
        if (index > -1) {
          files.splice(index, 1);
        }
        setFiles(files);
      });
  }

  async function downlaodZipFile() {
    var fileName = "SheepHouse-Fotos-Imóvel.zip";
    await api
      .post(
        "/storages/storage/" + uploadType + "/folder/" + folderName + "/zip",
        { fileName: fileName }
      )
      .then(response => {
        enqueueSnackbar(
          "Gerando arquivo ZIP \n este processo leva em media 15 segundos.",
          {
            variant: "success",
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center"
            }
          }
        );
      });

    while (true) {
      var responseDonwloadURL = await api.get(
        "/storages/zip/filename/" + fileName + "/download"
      );
      if (responseDonwloadURL.data.exists == true) {
        axios({
          url: responseDonwloadURL.data.url,
          method: "GET",
          responseType: "blob"
        }).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
        });
        break;
      }
    }

    setOpen(true);
  }

  return (
    <>
      <div className={classes.main}>
        <MaterialTable
          title="Gerenciador de arquivos"
          actions={[
            rowData => ({
              icon: "delete",
              tooltip: "Excluir",
              onClick: (event, rowData) => {
                deleteFile(rowData);
              },
              hidden: clientCode
            }),
            {
              icon: "cloud_upload",
              tooltip: "Upload",
              isFreeAction: true,
              onClick: () => {
                history.push("/fileuploader/" + uploadType + "/" + folderName);
              },
              hidden: clientCode
            },
            {
              icon: () => (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Baixar imagens
                </Button>
              ),
              tooltip: "Baixar todos os arquivos",
              isFreeAction: true,
              onClick: () => {
                downlaodZipFile();
              },
              hidden: false
            }
          ]}
          columns={columns}
          data={files}
          localization={{
            body: {
              filterRow: {
                filterTooltip: "Filtro"
              },
              emptyDataSourceMessage: "Sem registros para mostrar"
            },
            header: {
              actions: "Ações"
            },
            toolbar: {
              searchTooltip: "Pesquisar",
              searchPlaceholder: "Pesquisar"
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
              lastTooltip: "Última Página"
            }
          }}
          options={{
            search: false,
            pageSize: 5,
            filtering: true
          }}
        />
      </div>
      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        open={open}
        onClose={handleClose}
      >
        <DialogContent>
          <img
            src="../../assets/dicas_descompactar_sheephouse.jpg"
            alt="Sheep House"
            width={"100%"}
            className={classes.imgDialog}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const mapStateToProps = state => ({
  clientCode: state.clientCode
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(FileDownloader);
