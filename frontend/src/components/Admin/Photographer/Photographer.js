import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";

import api from "../../../services/api";

function Photographer({ enqueueSnackbar }) {
  const [photographers, setPhotographers] = useState([]);
  const [regions, setRegions] = useState([]);
  const columns = [
    { title: "Nome", field: "name", defaultSort: "asc" },
    { title: "E-mail", field: "email" },
    { title: "Região", field: "region_id", lookup: { ...regions } },
    { title: "Drone", field: "drone", type: "boolean" },
    { title: "Ativo", field: "active", type: "boolean", editable: "onUpdate" }
  ];

  const queryString = window.location.search,
    urlParams = new URLSearchParams(queryString),
    code = urlParams.get("code"),
    id = localStorage.getItem("photographer_id");

  useEffect(() => {
    handleLoad();
    handleLoadLookup();

    if (code && id) {
      handleFirstAuth(code, id);
    }
  }, []);

  async function handleAuthUrl() {
    await api.post(`/google/auth/url`, {}).then(async response => {
      window.open(response.data);
    });
  }

  async function handleFirstAuth(code, id) {
    await api
      .post(`/google/auth/first`, { code, id })
      .then(response => {
        enqueueSnackbar("Fotográfo autenticado com sucesso!", {
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
        enqueueSnackbar("Erro ao autenticar fotográfo!", {
          variant: "error",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      });
  }

  async function handleLoadLookup() {
    await api.get("/region").then(response => {
      let data = [];

      response.data.map(item => {
        return (data[item.id] = item.name);
      });

      setRegions(data);
    });
  }

  async function handleLoad() {
    await api.get("/photographer").then(response => {
      setPhotographers(response.data);
    });
  }

  async function handleAdd(newData) {
    const { name, email, drone, region_id, active } = newData;

    if (!name) {
      enqueueSnackbar("Informe o nome do fotógrafo!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!email) {
      enqueueSnackbar("Informe o e-mail do fotógrafo!", {
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
      .post(`/photographer`, { name, email, drone, region_id, active })
      .then(response => {
        enqueueSnackbar("Registro cadastrada com sucesso!", {
          variant: "success",
          autoHideDuration: 2500,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });

        localStorage.setItem("photographer_id", response.data.id);
        handleLoad();
        handleAuthUrl();
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
    const { name, email, drone, region_id, id, active } = newData;

    if (!name) {
      enqueueSnackbar("Informe o nome do fotógrafo!", {
        variant: "error",
        autoHideDuration: 2500,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    if (!email) {
      enqueueSnackbar("Informe o e-mail do fotógrafo!", {
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
      .put(`/photographer/${id}`, { name, email, drone, region_id, active })
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
      title="Fotógrafos"
      columns={columns}
      data={photographers}
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

export default withSnackbar(Photographer);
