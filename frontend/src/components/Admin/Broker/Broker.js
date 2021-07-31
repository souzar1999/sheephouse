import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";

import api from "../../../services/api";

import history from "../../../history";

function Broker({ enqueueSnackbar }) {
  const [brokers, setBrokers] = useState([]);
  const columns = [
    { title: "Nome", field: "name", defaultSort: "asc" },
    { title: "E-mail", field: "email" },
    {
      title: "Serviços",
      field: "services",
      editable: "never",
      render: (rowData) => {
        let services = "";
        if (rowData) {
          rowData.services.map((service) => {
            if (services != "") services += ", ";

            services += service.name;
          });
        }
        return services;
      },
    },
    { title: "Ativo", field: "active", type: "boolean", editable: "onUpdate" },
  ];

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    await api.get("/broker").then((response) => {
      setBrokers(response.data);
    });
  }

  async function handleAdd(newData) {
    const { name, email, active } = newData;

    if (!name) {
      enqueueSnackbar("Informe o nome da imobiliária!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!email) {
      enqueueSnackbar("Informe o email da imoiliária!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      enqueueSnackbar("Informe um email válido!", {
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
      .post(`/broker`, { name, email, active })
      .then((response) => {
        enqueueSnackbar("Registro cadastrada com sucesso!", {
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
    const { name, email, active, id } = newData;

    if (!name) {
      enqueueSnackbar("Informe o nome da imobiliária!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!email) {
      enqueueSnackbar("Informe o email da imoiliária!", {
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
      return;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      enqueueSnackbar("Informe um email válido!", {
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
      .put(`/broker/${id}`, { name, email, active })
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
    <div>
      <MaterialTable
        title="Imobiliárias"
        columns={columns}
        data={brokers}
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
        }}
        actions={[
          (rowData) => ({
            icon: "monetization_on_icon",
            tooltip: "Editar informações de cobrança",
            onClick: (event, rowData) => {
              history.push(`/admin/broker/${rowData.id}/services/`);
            },
          }),
        ]}
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

export default withSnackbar(Broker);
