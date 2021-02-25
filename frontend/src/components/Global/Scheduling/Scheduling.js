import React, { useEffect, useState } from "react";
import MaterialTable, { MTableCell } from "material-table";
import Container from "@material-ui/core/Container";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import axios from "axios";
import api from "../../../services/api";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";

import history from "../../../history";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  main: {
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
      marginTop: theme.spacing(8),
    },
  },
  imgDialog: {
    [theme.breakpoints.down("sm")]: {
      paddingTop: theme.spacing(8),
    },
  },
}));

function Scheduling({ enqueueSnackbar, clientCode }) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  const [Schedulings, setScheduling] = useState([]),
    [Photographers, setPhotographers] = useState([]),
    columns = [
      {
        title: "Serviço",
        field: "serviceName",
      },
      {
        title: "Cliente",
        field: "clientName",
        defaultSort: "asc",
        hidden: clientCode,
      },
      {
        title: "Dia",
        field: "day",
        defaultSort: "asc",
        type: "numeric",
        cellStyle: {
          textAlign: "right",
        },
        filterCellStyle: {
          paddingLeft: 2,
          paddingRight: 2,
        },
      },
      {
        title: "Mês",
        field: "month",
        lookup: {
          1: "Janeiro",
          2: "Fevereiro",
          3: "Março",
          4: "Abril",
          5: "Maio",
          6: "Junho",
          7: "Julho",
          8: "Agosto",
          9: "Setembro",
          10: "Outubro",
          11: "Novembro",
          12: "Dezembro",
          "": "Administrador irá agendar",
        },
      },
      {
        title: "Ano",
        field: "year",
        defaultSort: "asc",
        filterPlaceholder: "9999",
        cellStyle: {
          textAlign: "right",
        },
        filterCellStyle: {
          paddingLeft: 2,
          paddingRight: 2,
        },
      },
      {
        title: "Horario",
        field: "horary",
        defaultSort: "asc",
        cellStyle: {
          textAlign: "center",
        },
      },
      {
        title: "Fotografo",
        field: "photographer_id",
        defaultSort: "asc",
        render: (rowData) => {
          const name = rowData.photographer.name.split(" ");
          return name[0];
        },
        lookup: { ...Photographers },
        hidden: small,
      },
      {
        title: "Status",
        field: "status",
        lookup: {
          0: "Cancelado",
          1: "Pendente",
          2: "Ativo",
          3: "Enviado",
          4: "Concluído",
        },
        hidden: small,
      },
      { title: "UUID", field: "file_manager_uuid", type: "text", hidden: true },
    ];

  useEffect(() => {
    handleLoad();
    handleLoadLookup();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const FileDownload = require("js-file-download");

  async function downlaodZipFile(uploadType, folderName, SchedulingId) {
    setOpen(true);

    await api.put(`/scheduling/${SchedulingId}`, { downloaded: 1 });
    var responseZip = await api.get(
      "/storages/storage/" + uploadType + "/folder/" + folderName + "/zip"
    );
    window.open(
      "https://zipper.sheephouse.com.br" + "/?ref=" + responseZip.data.result,
      "_blank"
    );
  }

  async function handleLoad() {
    if (clientCode) {
      await api.get(`/Scheduling/byclient/${clientCode}`).then((response) => {
        let schedulingsData = [];

        response.data.forEach((item) => {
          if (item.date) {
            const date = item.date.split("-");
            item.day = date[2];
            item.month = parseInt(date[1]);
            item.year = parseInt(date[0]);
          } else {
            item.day = "";
            item.month = "";
            item.year = "";
          }

          if (!item.actived) {
            item.status = 0;
          } else if (item.downloaded) {
            item.status = 4;
          } else if (item.completed) {
            item.status = 3;
          } else if (
            new Date(`${item.date}T00:00:00-03:00`) <= new Date() &&
            new Date(`${item.date}T23:59:59-03:00`) >= new Date()
          ) {
            item.status = 1;
          } else {
            item.status = 2;
          }

          if (item.drone) {
            item.tipo = 1;
          } else if (item.tour360) {
            item.tipo = 2;
          } else {
            item.tipo = 0;
          }

          let serviceString = "";

          item.services.map((service) => {
            serviceString += ` ${service.name},`;
          });

          item.serviceName = serviceString.slice(0, -1);

          schedulingsData.push(item);
        });

        setScheduling(schedulingsData);
      });
    } else {
      await api.get("/Scheduling").then((response) => {
        let schedulingsData = [];

        response.data.forEach((item) => {
          if (item.date) {
            const date = item.date.split("-");
            item.day = date[2];
            item.month = parseInt(date[1]);
            item.year = parseInt(date[0]);
          } else {
            item.day = "";
            item.month = "";
            item.year = "";
          }

          if (!item.actived) {
            item.status = 0;
          } else if (item.downloaded) {
            item.status = 4;
          } else if (item.completed) {
            item.status = 3;
          } else if (
            new Date(`${item.date}T00:00:00-03:00`) <= new Date() &&
            new Date(`${item.date}T23:59:59-03:00`) >= new Date()
          ) {
            item.status = 1;
          } else {
            item.status = 2;
          }

          if (item.drone) {
            item.tipo = 1;
          } else if (item.tour360) {
            item.tipo = 2;
          } else {
            item.tipo = 0;
          }

          let serviceString = "";

          item.services.map((service) => {
            serviceString += ` ${service.name},`;
          });

          item.serviceName = serviceString.slice(0, -1);

          item.clientName = item.client.name;

          schedulingsData.push(item);
        });

        setScheduling(schedulingsData);
      });
    }
  }

  async function handleLoadLookup() {
    await api.get("/photographer").then((response) => {
      let data = [];

      response.data.map((item) => {
        return (data[item.id] = item.name);
      });

      setPhotographers(data);
    });
  }

  async function resendEmail(id) {
    await api.get(`/scheduling/${id}/resend`).then((response) => {
      enqueueSnackbar("Email reenviado!", {
        variant: "success",
        autoHideDuration: 2500,
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
          title="Agendamentos"
          columns={columns}
          data={Schedulings}
          detailPanel={[
            {
              tooltip: "Mais informações",
              render: (rowData) => {
                return (
                  <div style={{ margin: "0 50px" }}>
                    {rowData.photo_link && (
                      <p>
                        <a href={rowData.photo_link}>
                          <strong>Baixar Fotos</strong>
                        </a>
                      </p>
                    )}
                    {rowData.video_link && (
                      <p>
                        <a href={rowData.video_link}>
                          <strong>Baixar Videos</strong>
                        </a>
                      </p>
                    )}
                    {rowData.tour_link && (
                      <p>
                        <a href={rowData.tour_link}>
                          <strong>Baixar Tour</strong>
                        </a>
                      </p>
                    )}
                    {small && (
                      <p>
                        <strong>Status:</strong>
                        {rowData.status == 0
                          ? " Cancelado"
                          : rowData.status == 1
                          ? " Pendente"
                          : rowData.status == 2
                          ? " Ativo"
                          : rowData.status == 3
                          ? " Enviado"
                          : " Concluído"}
                      </p>
                    )}
                    {small && (
                      <p>
                        <strong>Fotógrafo:</strong>
                        {" " + rowData.photographer.name}
                      </p>
                    )}
                    <p>
                      <strong>Endereço:</strong> {rowData.address}
                    </p>
                    <p>
                      <strong>Complemento:</strong> {rowData.complement}
                    </p>
                    <p>
                      <strong>Observações:</strong> {rowData.comments}
                    </p>
                    {rowData.date_cancel && (
                      <p>
                        <strong>Cancelamento:</strong>
                        {" " +
                          new Date(rowData.date_cancel)
                            .toISOString()
                            .split("T")[0]
                            .split("-")[2] +
                          "/" +
                          new Date(rowData.date_cancel)
                            .toISOString()
                            .split("T")[0]
                            .split("-")[1] +
                          "/" +
                          new Date(rowData.date_cancel)
                            .toISOString()
                            .split("T")[0]
                            .split("-")[0] +
                          " " +
                          new Date(rowData.date_cancel)
                            .toTimeString()
                            .split(" ")[0]}
                      </p>
                    )}
                    {rowData.reason && !clientCode && (
                      <p>
                        <strong>Motivo reagendamento:</strong>
                        {" " + rowData.reason}
                      </p>
                    )}
                  </div>
                );
              },
            },
          ]}
          actions={[
            (rowData) => ({
              icon: "send",
              tooltip: "Reenviar email",
              onClick: (event, rowData) => {
                resendEmail(rowData.id);
              },
              hidden:
                clientCode ||
                !rowData.completed ||
                !rowData.actived ||
                !rowData.date ||
                rowData.downloaded,
            }),
            (rowData) => ({
              icon: "photo_library",
              tooltip: "Fotos",
              onClick: (event, rowData) => {
                console.log(rowData);
                if (!clientCode) {
                  history.push(
                    `filemanager/Scheduling/${rowData.file_manager_uuid}/${rowData.id}`
                  );
                } else {
                  window.open(rowData.photo_link);
                }
              },
              hidden:
                (clientCode && !rowData.photo_link) ||
                !rowData.actived ||
                !rowData.date,
            }),
            (rowData) => ({
              icon: "videocam",
              tooltip: "Vídeos",
              onClick: (event, rowData) => {
                if (clientCode) {
                  window.open(rowData.video_link);
                }
              },
              hidden: (clientCode && !rowData.video_link) || !clientCode,
            }),
            (rowData) => ({
              icon: "camera_enhance",
              tooltip: "Tour 360",
              onClick: (event, rowData) => {
                console.log(rowData);
                if (clientCode) {
                  window.open(rowData.tour_link);
                }
              },
              hidden: (clientCode && !rowData.tour_link) || !clientCode,
            }),
            (rowData) => ({
              icon: "event",
              tooltip: "Reagendar/Cancelar",
              onClick: (event, rowData) => {
                history.push(`/scheduling/${rowData.id}`);
              },
              hidden: rowData.completed || !rowData.actived || !rowData.date,
            }),
            (rowData) => ({
              icon: "event",
              tooltip: "Agendar",
              onClick: (event, rowData) => {
                history.push(`/scheduling/${rowData.id}`);
              },
              hidden: rowData.date || clientCode,
            }),
            {
              icon: "add",
              tooltip: "Agendar",
              isFreeAction: true,
              onClick: (event) => history.push(`/admin/scheduling/`),
              hidden: clientCode,
            },
          ]}
          components={{
            Cell: (props) => {
              return (
                <MTableCell
                  style={{
                    background: !props.rowData.date
                      ? "#ddd"
                      : props.rowData.downloaded
                      ? "#bbbbff"
                      : props.rowData.completed
                      ? "#bbffbb"
                      : !props.rowData.actived
                      ? "#ffbbbb"
                      : props.rowData.changed
                      ? "#ffffbb"
                      : "inherit",
                  }}
                  {...props}
                />
              );
            },
          }}
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
            pageSize: 20,
            filtering: true,
            emptyRowsWhenPaging: false,
          }}
        />
      </div>
      <Dialog
        fullScreen={small}
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

const mapStateToProps = (state) => ({
  clientCode: state.clientCode,
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(Scheduling);
