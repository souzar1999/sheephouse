import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";
import { useParams } from "react-router-dom";

import api from "../../../../../services/api";

function FileDownloader({ enqueueSnackbar }) {
    const { uploadType,folderName } = useParams();
    const [files, setFiles] = useState([]);
    const columns = [
        { title: "Nome", field: "Key", defaultSort: "asc" },
        { title: "Modificação", field: "LastModified", defaultSort: "asc" },
    ];

    
    useEffect(() => {
        handleLoad();
    }, []);

    async function handleLoad() {
        await api.get("/storages/storage/"+ uploadType +"/folder/"+folderName).then(response => {
            setFiles(response.data.result);
        });
    }

    return (
        <MaterialTable
            title="Arquivos"
            actions={[rowData => ({
                icon: "photo_library",
                tooltip: "Visualizar",
                onClick: (event, rowData) => alert("You want to delete"),
            })]}
            columns={columns}
            data={files}
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

export default withSnackbar(FileDownloader);
