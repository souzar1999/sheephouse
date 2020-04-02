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

const useStyles = makeStyles(theme => ({
  main: {
    [theme.breakpoints.down("sm")]: {
      maxWidth: 375,
      marginTop: theme.spacing(8)
    }
  },
  imgDialog: {
    [theme.breakpoints.down("sm")]: {
      paddingTop: theme.spacing(8)
    }
  }
}));

function Scheduling({ enqueueSnackbar, clientCode }) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [Schedulings, setScheduling] = useState([]),
    [Clients, setClients] = useState([]),
    [Photographers, setPhotographers] = useState([]),
    [Horaries, setHoraries] = useState([]),
    columns = [
      {
        title: "Serviço",
        field: "drone",
        lookup: { 0: "Fotografia", 1: "Filmagem/Drone" }
      },
      {
        title: "Cliente",
        field: "client_id",
        defaultSort: "asc",
        lookup: { ...Clients },
        hidden: clientCode
      },
      {
        title: "Dia",
        field: "day",
        defaultSort: "asc",
        type: "numeric",
        cellStyle: {
          width: 400,
          maxWidth: 400,
          textAlign: "left"
        },
        filterCellStyle: {
          paddingTop: 15,
          paddingBottom: 15,
          paddingLeft: 2,
          paddingRight: 2
        },
        headerStyle: {
          width: 400,
          maxWidth: 400
        }
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
          "": "Administrador irá agendar"
        }
      },
      {
        title: "Ano",
        field: "year",
        defaultSort: "asc",
        filterPlaceholder: "9999",
        cellStyle: {
          width: 400,
          maxWidth: 400,
          textAlign: "left"
        },
        filterCellStyle: {
          paddingTop: 15,
          paddingBottom: 15,
          paddingLeft: 2,
          paddingRight: 2
        },
        headerStyle: {
          width: 400,
          maxWidth: 400
        }
      },
      {
        title: "Horario",
        field: "horary_id",
        defaultSort: "asc",
        lookup: { ...Horaries },
        cellStyle: {
          width: 120,
          maxWidth: 120,
          textAlign: "center"
        },
        headerStyle: {
          width: 120,
          maxWidth: 120
        }
      },
      {
        title: "Fotografo",
        field: "photographer_id",
        defaultSort: "asc",
        render: rowData => {
          const name = rowData.photographer.name.split(" ");
          return name[0];
        },
        lookup: { ...Photographers }
      },
      {
        title: "Ativo/Cancelado",
        field: "actived",
        lookup: {
          0: "Cancelado",
          1: "Ativo"
        }
      },
      { title: "Finalizado", field: "completed", type: "boolean" },
      { title: "UUID", field: "file_manager_uuid", type: "text", hidden: true }
    ];

  useEffect(() => {
    handleLoad();
    handleLoadLookup();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  async function downlaodZipFile(uploadType, folderName, SchedulingId) {
    var fileName =
      "SheepHouse-Fotos-Imovel" +
      Math.floor(Math.random() * 10000) +
      1 +
      ".zip";

    setOpen(true);

    await api.put(`/scheduling/${SchedulingId}`, { downloaded: 1 });
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
  }

  async function handleLoad() {
    if (clientCode) {
      await api.get(`/Scheduling/byclient/${clientCode}`).then(response => {
        let schedulingsData = [];

        response.data.forEach(item => {
          if (item.date) {
            const date = item.date.split("-");
            item.day = parseInt(date[2]);
            item.month = parseInt(date[1]);
            item.year = parseInt(date[0]);
          } else {
            item.day = "";
            item.month = "";
            item.year = "";
          }
          schedulingsData.push(item);
        });

        setScheduling(schedulingsData);
      });
    } else {
      await api.get("/Scheduling").then(response => {
        let schedulingsData = [];

        response.data.forEach(item => {
          if (item.date) {
            const date = item.date.split("-");
            item.day = parseInt(date[2]);
            item.month = parseInt(date[1]);
            item.year = parseInt(date[0]);
          } else {
            item.day = "";
            item.month = "";
            item.year = "";
          }
          schedulingsData.push(item);
        });

        setScheduling(schedulingsData);
      });
    }
  }

  async function handleLoadLookup() {
    await api.get("/photographer").then(response => {
      let data = [];

      response.data.map(item => {
        return (data[item.id] = item.name);
      });

      setPhotographers(data);
    });

    await api.get("/horary/active").then(response => {
      let data = [];

      response.data.map(item => {
        return (data[item.id] = item.time);
      });

      setHoraries(data);
    });

    await api.get("/client").then(response => {
      let data = [];

      response.data.map(item => {
        if (item.broker) {
          return (data[item.id] = `${item.name} (${item.broker.name})`);
        } else {
          return (data[item.id] = `${item.name}`);
        }
      });

      setClients(data);
    });
  }

  async function resendEmail(id) {
    await api.get(`/scheduling/${id}/resend`).then(response => {
      enqueueSnackbar("Email reenviado!", {
        variant: "success",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
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
              tooltip: "Show Name",
              render: rowData => {
                return (
                  <div style={{ margin: "0 50px" }}>
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
              }
            }
          ]}
          actions={[
            rowData => ({
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
                rowData.downloaded
            }),
            rowData => ({
              icon: "photo_library",
              tooltip: "Fotos",
              onClick: (event, rowData) => {
                if (clientCode) {
                  downlaodZipFile(
                    "Scheduling",
                    rowData.file_manager_uuid,
                    rowData.id
                  );
                } else {
                  history.push(
                    `filemanager/Scheduling/${rowData.file_manager_uuid}/${rowData.id}`
                  );
                }
              },
              hidden:
                (clientCode && !rowData.completed) ||
                !rowData.actived ||
                !rowData.date
            }),
            rowData => ({
              icon: "event",
              tooltip: "Reagendar/Cancelar",
              onClick: (event, rowData) => {
                history.push(`/scheduling/${rowData.id}`);
              },
              hidden: rowData.completed || !rowData.actived || !rowData.date
            }),
            rowData => ({
              icon: "event",
              tooltip: "Agendar",
              onClick: (event, rowData) => {
                history.push(`/scheduling/${rowData.id}`);
              },
              hidden: rowData.date || clientCode
            }),
            {
              icon: "add",
              tooltip: "Agendar",
              isFreeAction: true,
              onClick: event => history.push(`/admin/scheduling/`),
              hidden: clientCode
            }
          ]}
          components={{
            Cell: props => {
              return (
                <MTableCell
                  style={{
                    background: !props.rowData.date
                      ? "#ddd"
                      : props.rowData.downloaded
                      ? "#ddddff"
                      : props.rowData.completed
                      ? "#ddffdd"
                      : !props.rowData.actived
                      ? "#ffdddd"
                      : props.rowData.changed
                      ? "#ffffbb"
                      : "inherit"
                  }}
                  {...props}
                />
              );
            }
          }}
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
            pageSize: 20,
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

export default compose(withSnackbar, withConnect)(Scheduling);
//"start": "serve -s build -l 3000",
