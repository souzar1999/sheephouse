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
      paddingTop: theme.spacing(8),
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
    console.log(uploadType, folderName);
    var responseZip = await api.get(
      "/storages/storage/" + uploadType + "/folder/" + folderName + "/zip"
    );
    console.log(responseZip);
    window.open(
      "https://zipper.sheephouse.com.br" + "/?ref=" + responseZip.data.result,
      "_blank"
    );
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
