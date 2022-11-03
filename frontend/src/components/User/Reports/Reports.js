import React, { useEffect, useState } from "react";
import MaterialTable, { MTableCell } from "material-table";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import api from "../../../services/api";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";

import history from "../../../history";

const useStyles = makeStyles((theme) => ({
  main: {
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
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
}));

function Reports({ enqueueSnackbar, clientCode }) {
  const classes = useStyles();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  const [Schedulings, setScheduling] = useState([]),
    [Photographers, setPhotographers] = useState([]),
    [Horaries, setHoraries] = useState([]),
    columns = [
      {
        title: "Serviço",
        field: "tipo",
        lookup: { 0: "Fotografia", 1: "Filmagem/Drone", 2: "Tour 360°" },
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
        defaultSort: "asc",
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
        field: "horary_id",
        defaultSort: "asc",
        lookup: { ...Horaries },
        cellStyle: {
          textAlign: "center",
        },
      },
      {
        title: "Fotografo",
        field: "photographer_id",
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
      {
        title: "Endereço",
        field: "address",
        hidden: true,
      },
      {
        title: "Complemento",
        field: "complement",
        hidden: true,
      },
    ];

  useEffect(() => {
    handleLoad();
    handleLoadLookup();
  }, []);

  async function handleLoad() {
    await api.get(`/Scheduling/byclient/${clientCode}`).then((response) => {
      let schedulingsComplete = [];

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

        schedulingsComplete.push(item);
      });

      setScheduling(schedulingsComplete);
    });
  }

  async function handleLoadLookup() {
    await api.get("/photographer").then((response) => {
      let data = [];

      response.data.map((item) => {
        return (data[item.id] = item.name);
      });

      setPhotographers(data);
    });

    await api.get("/horary/active").then((response) => {
      let data = [];

      response.data.map((item) => {
        return (data[item.id] = item.time);
      });

      setHoraries(data);
    });
  }

  return (
    <div className={classes.main}>
      <MaterialTable
        title="Relatório"
        columns={columns}
        data={Schedulings}
        detailPanel={[
          {
            tooltip: "Mais informações",
            render: (rowData) => {
              return (
                <div style={{ margin: "0 50px" }}>
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
                </div>
              );
            },
          },
        ]}
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
            exportTitle: "Exportar",
            exportAriaLabel: "Exportar",
            exportName: "Exportar Excel",
          },
        }}
        icons={{
          Export: () => (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Relatório
            </Button>
          ),
        }}
        options={{
          search: false,
          pageSize: 20,
          exportButton: true,
          filtering: true,
          paging: false,
          exportCsv: (columns, dataTable) => {
            let data = [];

            dataTable.forEach(async (item) => {
              data.push({
                Serviço: item.drone
                  ? "Filmagem/Drone"
                  : item.tour360
                  ? "Tour 360°"
                  : "Fotografia",
                Dia: item.day,
                Mês: item.month,
                Ano: item.year,
                Fotógrafo: item.photographer.name,
                Status:
                  item.status == 0
                    ? "Cancelado"
                    : item.status == 1
                    ? "Pendente"
                    : item.status == 2
                    ? "Ativo"
                    : item.status == 3
                    ? "Enviado"
                    : "Concluído",
                Endereço: item.address,
                Complemento: item.complement,
              });
            });

            setTimeout(() => {
              const fileType =
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
              const fileExtension = ".xlsx";

              const ws = XLSX.utils.json_to_sheet(data);
              const wb = {
                Sheets: { Relatório: ws },
                SheetNames: ["Relatório"],
              };
              const excelBuffer = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array",
              });
              const dataExport = new Blob([excelBuffer], { type: fileType });
              FileSaver.saveAs(
                dataExport,
                "Relatório-Sheephouse" + fileExtension
              );
            }, 5000);
          },
        }}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  clientCode: state.clientCode,
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(Reports);
