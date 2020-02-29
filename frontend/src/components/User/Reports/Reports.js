import React, { useEffect, useState } from "react";
import MaterialTable, { MTableCell } from "material-table";
import Grid from "@material-ui/core/Grid";

import api from "../../../services/api";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";

import history from "../../../history";

function Reports({ enqueueSnackbar, clientCode }) {
  const [Schedulings, setScheduling] = useState([]),
    [Photographers, setPhotographers] = useState([]),
    columns = [
      {
        title: "Serviço",
        field: "drone",
        lookup: { 0: "Fotografia", 1: "Filmagem/Drone" }
      },
      {
        title: "Dia",
        field: "day",
        defaultSort: "asc",
        filtering: false,
        type: "numeric"
      },
      {
        title: "Mês",
        field: "month",
        defaultSort: "asc",
        lookup: {
          "01": "Janeiro",
          "02": "Fevereiro",
          "03": "Março",
          "04": "Abril",
          "05": "Maio",
          "06": "Junho",
          "07": "Julho",
          "08": "Agosto",
          "09": "Setembro",
          "10": "Outubro",
          "11": "Novembro",
          "12": "Dezembro",
          "": "Administrador irá agendar"
        }
      },
      {
        title: "Ano",
        field: "year",
        defaultSort: "asc",
        filterPlaceholder: "9999",
        cellStyle: {
          width: 200,
          maxWidth: 200,
          textAlign: "left"
        },
        filterCellStyle: {
          paddingTop: 15,
          paddingBottom: 15,
          paddingLeft: 2,
          paddingRight: 2
        },
        headerStyle: {
          width: 200,
          maxWidth: 200
        }
      },
      {
        title: "Fotografo",
        field: "photographer_id",
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
      {
        title: "Endereço",
        field: "address",
        cellStyle: {
          display: "none"
        },
        filterCellStyle: {
          display: "none"
        },
        headerStyle: {
          display: "none"
        }
      },
      {
        title: "Complemento",
        field: "complement",
        cellStyle: {
          display: "none"
        },
        filterCellStyle: {
          display: "none"
        },
        headerStyle: {
          display: "none"
        }
      }
    ];

  useEffect(() => {
    handleLoad();
    handleLoadLookup();
  }, []);

  async function handleLoad() {
    await api.get(`/Scheduling/byclient/${clientCode}`).then(response => {
      let schedulingsComplete = [];

      response.data.forEach(item => {
        if (item.date) {
          const date = item.date.split("-");
          item.day = date[2];
          item.month = date[1];
          item.year = date[0];
        } else {
          item.day = "";
          item.month = "";
          item.year = "";
        }
        schedulingsComplete.push(item);
      });

      setScheduling(schedulingsComplete);
    });
  }

  async function handleLoadLookup() {
    await api.get("/photographer").then(response => {
      let data = [];

      response.data.map(item => {
        return (data[item.id] = item.name);
      });

      setPhotographers(data);
    });
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MaterialTable
          title="Relatório de sessões"
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
                  </div>
                );
              }
            }
          ]}
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
              exportTitle: "Exportar",
              exportAriaLabel: "Exportar",
              exportName: "Exportar Excel"
            }
          }}
          options={{
            search: false,
            exportButton: true,
            filtering: true,
            paging: false
          }}
        />
      </Grid>
    </Grid>
  );
}

const mapStateToProps = state => ({
  clientCode: state.clientCode
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(Reports);
