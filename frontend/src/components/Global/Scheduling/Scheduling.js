import React, { useEffect, useState } from "react";
import MaterialTable, { MTableCell } from "material-table";

import api from "../../../services/api";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";

import history from "../../../history";

function Scheduling({ enqueueSnackbar, clientCode }) {
  const [Schedulings, setScheduling] = useState([]),
    [Clients, setClients] = useState([]),
    [Photographers, setPhotographers] = useState([]),
    [Horaries, setHoraries] = useState([]),
    columns = [
      {
        title: "Cliente",
        field: "client_id",
        defaultSort: "asc",
        lookup: { ...Clients },
        hidden: clientCode
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
      { title: "Ativo", field: "actived", type: "boolean" },
      { title: "Finalizado", field: "completed", type: "boolean" }
    ];

  useEffect(() => {
    handleLoad();
    handleLoadLookup();
  }, []);

  async function handleLoad() {
    if (clientCode) {
      await api.get(`/Scheduling/byclient/${clientCode}`).then(response => {
        setScheduling(response.data);
      });
    } else {
      await api.get("/Scheduling").then(response => {
        setScheduling(response.data);
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
                  <strong>Complemento:</strong> {rowData.complement}
                </p>
              </div>
            );
          }
        }
      ]}
      actions={[
        rowData => ({
          icon: "photo_library",
          tooltip: "Fotos",
          onClick: (event, rowData) => alert("You want to delete"),
          hidden: (clientCode && !rowData.completed) || !rowData.actived
        }),
        rowData => ({
          icon: "event",
          tooltip: "Reagendar/Cancelar",
          onClick: (event, rowData) => {
            history.push(`/scheduling/${rowData.id}`);
          },
          hidden: rowData.completed || !rowData.actived
        }),
        {
          icon: "add",
          tooltip: "Agendar",
          isFreeAction: true,
          onClick: event =>
            clientCode
              ? history.push(`/scheduling/photo`)
              : history.push(`/admin/scheduling/`)
        }
      ]}
      components={{
        Cell: props => {
          return (
            <MTableCell
              style={{
                background: props.rowData.completed
                  ? "#eefeee"
                  : !props.rowData.actived
                  ? "#feeeee"
                  : props.rowData.changed
                  ? "#eeeefe"
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
        filtering: true
      }}
    />
  );
}

const mapStateToProps = state => ({
  clientCode: state.clientCode
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(Scheduling);
