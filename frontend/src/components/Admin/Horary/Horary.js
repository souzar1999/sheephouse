import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";

import api from "../../../services/api";

function Horary({ enqueueSnackbar }) {
  const [horaries, setHoraries] = useState([]);
  const columns = [
    { title: "Horário", field: "time", defaultSort: "asc" },
    { title: "Ativo", field: "active", type: "boolean", editable: "onUpdate" }
  ];

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    await api.get("/horary").then(response => {
      setHoraries(response.data);
    });
  }

  async function handleAdd(newData) {
    const { time, active } = newData;

    if (!time) {
      enqueueSnackbar("Informe o horário!", {
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
      .post(`/horary`, { time, active })
      .then(response => {
        enqueueSnackbar("Registro cadastrada com sucesso!", {
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
    const { time, id, active } = newData;

    if (!time) {
      enqueueSnackbar("Informe o horário!", {
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
      .put(`/horary/${id}`, { time, active })
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

  async function handleDelete(oldData) {
    const { id } = oldData;

    await api
      .delete(`/horary/${id}`)
      .then(response => {
        enqueueSnackbar("Registro deletado com sucesso!", {
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
        enqueueSnackbar("Erro ao excluir registro!", {
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
      title="Horários"
      columns={columns}
      data={horaries}
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
          }),

        onRowDelete: oldData =>
          new Promise(resolve => {
            resolve();
            handleDelete(oldData);
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

export default withSnackbar(Horary);
