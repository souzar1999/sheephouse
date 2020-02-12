import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";

import api from "../../../services/api";

import history from "../../../history";

function Scheduling({ enqueueSnackbar }) {
  const [Schedulings, setScheduling] = useState([]),
    [Clients, setClients] = useState([]),
    [Photographers, setPhotographers] = useState([]),
    [Horaries, setHoraries] = useState([]),
    columns = [
      {
        title: "Cliente",
        field: "client_id",
        defaultSort: "asc",
        lookup: { ...Clients }
      },
      {
        title: "Data",
        field: "date",
        defaultSort: "asc",
        type: "date",
        cellStyle: {
          width: 150,
          maxWidth: 150,
          textAlign: "center"
        },
        headerStyle: {
          width: 150,
          maxWidth: 150
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
      { title: "Drone", field: "drone", type: "boolean" }
    ];

  useEffect(() => {
    handleLoad();
    handleLoadLookup();
  }, []);

  async function handleLoad() {
    await api.get("/Scheduling").then(response => {
      setScheduling(response.data);
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
        return (data[item.id] = `${item.name} (${item.broker.name})`);
      });

      setClients(data);
    });
  }

  return (
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
                  <strong>Complemento:</strong>
                  {rowData.complement}
                </p>
              </div>
            );
          }
        }
      ]}
      actions={[
        {
          icon: "edit",
          tooltip: "Reagendar",
          onClick: async (event, rowData) => {
            history.push(`/admin/rescheduling/${rowData.id}`);
          }
        },
        {
          icon: "cancel",
          tooltip: "Cancelar",
          onClick: async (event, rowData) => {
            const scheduling_id = rowData.id;

            await api
              .post(`/google/event/cancelEvent`, {
                scheduling_id
              })
              .then(response => {
                enqueueSnackbar("Sessão cancelada com sucesso!", {
                  variant: "success",
                  autoHideDuration: 2500,
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "center"
                  }
                });
              })
              .catch(error => {
                enqueueSnackbar("Problemas ao cancelar agendamento!", {
                  variant: "error",
                  autoHideDuration: 2500,
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "center"
                  }
                });
              });
          }
        },
        {
          icon: "backup",
          tooltip: "Fotos",
          onClick: (event, rowData) => alert("You want to delete")
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
        filtering: true
      }}
    />
  );
}

export default withSnackbar(Scheduling);
