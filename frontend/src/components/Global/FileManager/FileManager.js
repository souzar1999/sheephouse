import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { withSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { compose } from "redux";

import { connect } from "react-redux";

import api from "../../../services/api";
import history from "../../../history";


function FileDownloader({ enqueueSnackbar, clientCode }) {
    const FileDownload = require('js-file-download');
    const { uploadType, folderName } = useParams();
    const [files, setFiles] = useState([]);
    const columns = [
        { title: "Nome", field: "Key", defaultSort: "asc" },
        { title: "Modificação", field: "LastModified", defaultSort: "asc" },
    ];


    useEffect(() => {
        handleLoad();
    }, []);

    async function handleLoad() {
        await api.get("/storages/storage/" + uploadType + "/folder/" + folderName).then(response => {
            setFiles(response.data.result);
        });
    }

    async function viewFile(filename) {
        await api.get("/storages/storage/" + uploadType + "/folder/" + folderName + "/" + filename + "/download").then(response => {
            window.open(response.data.result, "_blank")
        });
    }

    async function downloadFile(filename) {
        await api.get("/storages/storage/" + uploadType + "/folder/" + folderName + "/" + filename + "/download").then(response => {
            axios.get(response.data.result).then((response) => {
                 FileDownload(response.data, filename);
            });
            
        });
    }

    async function deleteFile(rowData) {
        await api.delete("/storages/storage/" + uploadType + "/folder/" + folderName + "/" + rowData.Key + "/delete").then(response => {
            enqueueSnackbar("Arquivo Removido com sucesso!", {
                variant: "success",
                autoHideDuration: 2500,
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "center"
                }
              });
              const index = files.indexOf(rowData);
              if (index > -1) {
                files.splice(index, 1);
              }
              setFiles(files);
        });
    }

    async function downlaodZipFile() {
        
    }

    return (
        <MaterialTable
            title="Gerenciador de arquivos"
            actions={[rowData => ({
                icon: "photo_library",
                tooltip: "Visualizar",
                onClick: (event, rowData) => {
                    viewFile(rowData.Key)
                }
            }),
            rowData => ({
                icon: "cloud_download",
                tooltip: "Baixar",
                onClick: (event, rowData) => {
                    downloadFile(rowData.Key)
                }
            }),
            rowData => ({
                icon: "delete",
                tooltip: "Excluir",
                onClick: (event, rowData) => {
                    deleteFile(rowData)
                },
                hidden: clientCode
            }),
            {
                icon: "cloud_upload",
                tooltip: "Upload",
                isFreeAction: true,
                onClick: () => {
                    history.push("/fileuploader/" + uploadType + "/" + folderName);
                },
                hidden: clientCode
            },
            {
                icon: "cloud_download",
                tooltip: "Baixar todos os arquivos",
                isFreeAction: true,
                onClick: () => {
                    downlaodZipFile()
                },
                hidden: true
            }
            ]}
            columns={columns}
            data={files}
            localization={{
                body: {
                    filterRow: {
                        filterTooltip: "Filtro"
                    },
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

const mapStateToProps = state => ({
    clientCode: state.clientCode
  });
  
  const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(FileDownloader);
