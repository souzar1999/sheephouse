import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";

import api from "../../../services/api";

function Scheduling({ enqueueSnackbar }) {
  const [Schedulings, setScheduling] = useState([]);
  const columns = [
    { title: "Cliente", field: "client.name", defaultSort: "asc" },
    { title: "Data", field: "date", defaultSort: "asc" },
    { title: "Horario", field: "horary.time", defaultSort: "asc" },
    { title: "Fotografo", field: "photographer.name", defaultSort: "asc" },
    { title: "Endereço", field: "address", defaultSort: "asc" },
    { title: "Complemento", field: "complement", defaultSort: "asc" },
    { title: "Drone", field: "drone", type: "boolean", editable: "onUpdate" },
    { title: "Ativo", field: "active", type: "boolean", editable: "onUpdate" }
  ];

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    await api.get("/Scheduling").then(response => {
      setScheduling(response.data);
    });
  }

  async function handleAdd(newData) {
    const { name, active } = newData;

    if (!name) {
      enqueueSnackbar("Informe o nome da região!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    await api
      .post(`/Scheduling`, { name, active })
      .then(response => {
        enqueueSnackbar("Registro cadastrado com sucesso!", {
          variant: "success",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });

        handleLoad();
      })
      .catch(error => {
        enqueueSnackbar("Erro ao cadastrar registro!", {
          variant: "error",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      });
  }

  async function handleUpdate(newData, oldData) {
    const { name, active, id } = newData;

    if (!name) {
      enqueueSnackbar("Informe o nome da região!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    await api
      .put(`/Scheduling/${id}`, { name, active })
      .then(response => {
        enqueueSnackbar("Registro atualizado com sucesso!", {
          variant: "success",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });

        handleLoad();
      })
      .catch(error => {
        enqueueSnackbar("Erro ao atualizar registro!", {
          variant: "error",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      });
  }

  return (
    <MaterialTable
      title="Agendamentos"
      columns={columns}
      data={Schedulings}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            resolve();
            handleAdd(newData);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            resolve();
            handleUpdate(newData, oldData);
          })
      }}
      localization={{
        body: {
          editRow: {
            saveTooltip: "Salvar",
            cancelTooltip: "Cancelar",
            deleteText: "Deseja excluir este registro?"
          },
          filterRow: {
            filterTooltip: "Filtro"
          },
          addTooltip: "Adicionar",
          deleteTooltip: "Deletar",
          editTooltip: "Editar",
          emptyDataSourceMessage: "Sem registros para mostrar"
        },
        header: {
          actions: "Ações"
        },
        toolbar: {
          searchTooltip: "Pesquisar",
          searchPlaceholder: "Pesquisar"
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
