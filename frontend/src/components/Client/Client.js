import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";

import api from "../../services/api";

function Client({ enqueueSnackbar }) {
  const [clients, setClients] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const columns = [
    { title: "Nome", field: "name", defaultSort: "asc" },
    { title: "Imobiliária", field: "broker_id", lookup: { ...brokers } },
    { title: "Telefone", field: "phone" },
    { title: "Email", field: "user.email" }
  ];

  useEffect(() => {
    handleLoad();
    handleLoadLookup();
  }, []);

  async function handleLoadLookup() {
    await api.get("/broker").then(response => {
      let data = [];

      response.data.map(item => {
        return (data[item.id] = item.name);
      });

      setBrokers(data);
    });
  }

  async function handleLoad() {
    await api.get("/client").then(response => {
      setClients(response.data);
    });
  }

  async function handleAdd(newData) {
    const { name, broker_id } = newData;

    if (!name) {
      enqueueSnackbar("Informe o nome do corretor!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!broker_id) {
      enqueueSnackbar("Informe a imobiliária!", {
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
      .post(`/client`, { name, broker_id })
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
    const { name, broker_id, id } = newData;

    if (!name) {
      enqueueSnackbar("Informe o nome do corretor!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!broker_id) {
      enqueueSnackbar("Informe a região!", {
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
      .put(`/client/${id}`, { name, broker_id })
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
      .delete(`/client/${id}`)
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
      title="Corretor"
      columns={columns}
      data={clients}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            resolve();
            console.log(newData);
            //handleAdd(newData);
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
    />
  );
}

export default withSnackbar(Client);