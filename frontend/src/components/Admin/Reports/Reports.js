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
        lookup: { 0: "Fotografia Imobiliária", 1: "Filmagem Aérea" }
      },
      {
        title: "Imobiliária",
        field: "client.broker_id",
        lookup: { ...Brokers }
      },
      {
        title: "Cliente",
        field: "client_id",
        filtering: false,
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
          "12": "Dezembro"
        }
      },
      {
        title: "Ano",
        field: "year",
        defaultSort: "asc",
        filterPlaceholder: "9999",
        cellStyle: {
          width: 120,
          maxWidth: 120,
          textAlign: "left"
        },
        headerStyle: {
          width: 120,
          maxWidth: 120
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
        lookup: { 0: "Fotografia Imobiliária", 1: "Filmagem Aérea" }
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
          "12": "Dezembro"
        }
      },
      {
        title: "Ano",
        field: "year",
        defaultSort: "asc",
        filterPlaceholder: "9999",
        cellStyle: {
          width: 120,
          maxWidth: 120,
          textAlign: "left"
        },
        headerStyle: {
          width: 120,
          maxWidth: 120
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
        if (!item.completed) {
          const date = item.date.split("-");
          item.day = date[2];
          item.month = date[1];
          item.year = date[0];
          schedulingsComplete.push(item);
        }
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
        return (data[item.id] = `${item.name}`);
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
