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

function Client({ enqueueSnackbar }) {
  const classes = useStyles();
  const [clients, setClients] = useState([]),
    [brokers, setBrokers] = useState([]),
    columns = [
      { title: "Nome", field: "name", defaultSort: "asc" },
      { title: "Imobiliária", field: "broker.id", lookup: { ...brokers } },
      { title: "Telefone", field: "phone" },
      { title: "Email", field: "user.email", editable: "never" },
      {
        title: "Ativo",
        field: "actived",
        type: "boolean",
        editable: "onUpdate",
      },
    ];

  useEffect(() => {
    handleLoad();
    handleLoadLookup();
  }, []);

  async function handleLoadLookup() {
    await api.get("/broker").then((response) => {
      let data = [];

      response.data.map((item) => {
        return (data[item.id] = item.name);
      });

      setBrokers(data);
    });
  }

  async function handleLoad() {
    await api.get("/client").then((response) => {
      setClients(response.data);
      console.log(response.data);
    });
  }

  async function handleUpdate(newData, oldData) {
    const { name, broker_id, id, phone, actived } = newData;

    if (!name) {
      enqueueSnackbar("Informe o nome do corretor!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!broker_id) {
      enqueueSnackbar("Informe a imobiliária!", {
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
      .put(`/client/${id}`, { name, broker_id, phone, actived })
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

  return (
    <div className={classes.main}>
      <MaterialTable
        title="Corretor"
        columns={columns}
        data={clients}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              resolve();
              handleUpdate(newData, oldData);
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

export default withSnackbar(Client);
