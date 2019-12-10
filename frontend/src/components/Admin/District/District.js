import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";

import api from "../../../services/api";

function District({ enqueueSnackbar }) {
  const [districts, setDistricts] = useState([]);
  const [regions, setRegions] = useState([]);
  const columns = [
    { title: "Nome", field: "name", defaultSort: "asc" },
    { title: "Região (Cidade)", field: "region_id", lookup: { ...regions } },
    { title: "Ativo", field: "active", type: "boolean", editable: "onUpdate" }
  ];

  useEffect(() => {
    handleLoad();
    handleLoadLookup();
  }, []);

  async function handleLoadLookup() {
    await api.get("/region").then(response => {
      let data = [];

      response.data.map(item => {
        return (data[item.id] = `${item.name} (${item.city.name})`);
      });

      setRegions(data);
    });
  }

  async function handleLoad() {
    await api.get("/district").then(response => {
      setDistricts(response.data);
    });
  }

  async function handleAdd(newData) {
    const { name, region_id, active } = newData;

    if (!name) {
      enqueueSnackbar("Informe o nome do bairro!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!region_id) {
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
      .post(`/district`, { name, region_id, active })
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
    const { name, region_id, id, active } = newData;

    if (!name) {
      enqueueSnackbar("Informe o nome do bairro!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!region_id) {
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
      .put(`/district/${id}`, { name, region_id, active })
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
      .delete(`/district/${id}`)
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
      title="Bairros"
      columns={columns}
      data={districts}
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

export default withSnackbar(District);
