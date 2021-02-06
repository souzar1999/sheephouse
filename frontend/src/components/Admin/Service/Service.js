import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";

import api from "../../../services/api";

const useStyles = makeStyles((theme) => ({
  main: {
    [theme.breakpoints.down("sm")]: {
      maxWidth: 375,
      marginTop: theme.spacing(8),
    },
  },
}));

function Service({ enqueueSnackbar }) {
  const classes = useStyles();
  const [services, setServices] = useState([]);
  const columns = [{ title: "Serviço", field: "name", defaultSort: "asc" }];

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    await api.get("/service").then((response) => {
      setServices(response.data);
    });
  }

  async function handleAdd(newData) {
    const { name } = newData;

    if (!name) {
      enqueueSnackbar("Informe o serviço!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    await api
      .post(`/service`, { name })
      .then((response) => {
        enqueueSnackbar("Registro cadastrado com sucesso!", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });

        handleLoad();
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao cadastrar registro!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      });
  }

  async function handleUpdate(newData, oldData) {
    const { name, id } = newData;

    if (!name) {
      enqueueSnackbar("Informe o serviço!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    await api
      .put(`/service/${id}`, { name })
      .then((response) => {
        enqueueSnackbar("Registro atualizado com sucesso!", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });

        handleLoad();
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao atualizar registro!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      });
  }

  async function handleDelete(oldData) {
    const { id } = oldData;

    await api
      .delete(`/service/${id}`)
      .then((response) => {
        enqueueSnackbar("Registro deletado com sucesso!", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });

        handleLoad();
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao deletar registro!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      });
  }

  return (
    <div className={classes.main}>
      <MaterialTable
        title="Serviços"
        columns={columns}
        data={services}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              resolve();
              handleAdd(newData);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              resolve();
              handleUpdate(newData, oldData);
            }),
          onRowDelete: (newData, oldData) =>
            new Promise((resolve) => {
              resolve();
              handleDelete(newData, oldData);
            }),
        }}
        localization={{
          body: {
            editRow: {
              saveTooltip: "Salvar",
              cancelTooltip: "Cancelar",
              deleteText: "Deseja excluir este registro?",
            },
            filterRow: {
              filterTooltip: "Filtro",
            },
            addTooltip: "Adicionar",
            deleteTooltip: "Deletar",
            editTooltip: "Editar",
            emptyDataSourceMessage: "Sem registros para mostrar",
          },
          header: {
            actions: "",
          },
          toolbar: {
            searchTooltip: "Pesquisar",
            searchPlaceholder: "Pesquisar",
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
            lastTooltip: "Última Página",
          },
        }}
        options={{
          search: false,
          pageSize: 20,
          filtering: true,
        }}
      />
    </div>
  );
}

export default withSnackbar(Service);
