import React, { useEffect, useState } from "react";
import MaterialTable, { MTableCell } from "material-table";
import Grid from "@material-ui/core/Grid";

import api from "../../../services/api";
import { withSnackbar } from "notistack";

import history from "../../../history";

function Reports({ enqueueSnackbar }) {
  const [Schedulings, setScheduling] = useState([]),
    [Clients, setClients] = useState([]),
    [Brokers, setBrokers] = useState([]),
    [Photographers, setPhotographers] = useState([]),
    columnsBroker = [
      {
        title: "Serviço",
        field: "drone",
        lookup: { 0: "Fotografia", 1: "Filmagem/Drone" }
      },
      {
        title: "Imobiliária",
        field: "client.broker_id",
        lookup: { ...Brokers }
      },
      {
        title: "Cliente",
        field: "client_id",
        lookup: { ...Clients },
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
        title: "Dia",
        field: "day",
        defaultSort: "asc",
        filtering: false,
        type: "numeric"
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
    ],
    columnsClients = [
      {
        title: "Serviço",
        field: "drone",
        lookup: { 0: "Fotografia", 1: "Filmagem/Drone" }
      },
      {
        title: "Cliente",
        field: "client_id",
        lookup: { ...Clients }
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
    await api.get("/Scheduling").then(response => {
      let schedulingsComplete = [];

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

    await api.get("/broker").then(response => {
      let data = [];

      response.data.map(item => {
        return (data[item.id] = `${item.name}`);
      });

      setBrokers(data);
    });
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MaterialTable
          title="Relatório por imobiliária"
          columns={columnsBroker}
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
      <Grid item xs={12}>
        <MaterialTable
          title="Relatório por cliente"
          columns={columnsClients}
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

export default withSnackbar(Reports);
