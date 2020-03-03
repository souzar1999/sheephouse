import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";

import api from "../../../services/api";

const useStyles = makeStyles(theme => ({
  main: {
    [theme.breakpoints.down("sm")]: {
      maxWidth: 375,
      marginTop: theme.spacing(8)
    }
  }
}));

function City({ enqueueSnackbar }) {
  const classes = useStyles();
  const [cities, setCities] = useState([]);
  const columns = [
    { title: "Nome", field: "name", defaultSort: "asc" },
    { title: "Ativo", field: "active", type: "boolean", editable: "onUpdate" }
  ];

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    await api.get("/city").then(response => {
      setCities(response.data);
    });
  }

  async function handleAdd(newData) {
    const { name, active } = newData;

    if (!name) {
      enqueueSnackbar("Informe o nome da cidade!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    await api
      .post(`/city`, { name, active })
      .then(response => {
        enqueueSnackbar("Registro cadastrada com sucesso!", {
          variant: "success",
          autoHideDuration: 5000,
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
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      });
  }

  async function handleUpdate(newData, oldData) {
    const { name, id, active } = newData;

    if (!name) {
      enqueueSnackbar("Informe o nome da cidade!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
      return;
    }

    await api
      .put(`/city/${id}`, { name, active })
      .then(response => {
        enqueueSnackbar("Registro atualizado com sucesso!", {
          variant: "success",
          autoHideDuration: 5000,
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
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      });
  }

  return (
    <div className={classes.main}>
      <MaterialTable
        title="Cidades"
        columns={columns}
        data={cities}
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
    </div>
  );
}

export default withSnackbar(City);
