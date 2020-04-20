import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";

import axios from "axios";
import api from "../../services/api";
import { withSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  main: {
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
      marginTop: theme.spacing(8),
    },
  },
  imgDialog: {
    width: "60%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      paddingTop: theme.spacing(4),
    },
  },
}));

function UserDownload({ enqueueSnackbar, clientCode }) {
  const classes = useStyles(),
    { uploadType, folderName, dbCode } = useParams();

  useEffect(() => {
    downlaodZipFile(uploadType, folderName, dbCode);
  }, []);

  async function downlaodZipFile(uploadType, folderName, SchedulingId) {
    var fileName =
      "SheepHouse-Fotos-Imovel" +
      Math.floor(Math.random() * 10000) +
      1 +
      ".zip";

    await api.put(`/scheduling/${SchedulingId}`, { downloaded: 1 });
    await api
      .post(
        "/storages/storage/" + uploadType + "/folder/" + folderName + "/zip",
        { fileName: fileName }
      )
      .then((response) => {
        enqueueSnackbar(
          "Gerando arquivo ZIP \n este processo leva em media 15 segundos.",
          {
            variant: "success",
            autoHideDuration: 5000,
            anchorOrigin: {
              vertical: "top",
              horizontal: "center",
            },
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
          responseType: "blob",
        }).then((response) => {
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
  }

  return (
    <div className={classes.main}>
      <img
        src="../../../../assets/dicas_descompactar_sheephouse.jpg"
        alt="Sheep House"
        className={classes.imgDialog}
      />
    </div>
  );
}

export default withSnackbar(UserDownload);
