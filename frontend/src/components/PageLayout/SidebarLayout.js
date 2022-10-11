import React from "react";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItem from "@material-ui/core/ListItem";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import Sidebar from "./Sidebar";
import Sideitem from "./Sideitem";

import { compose } from "redux";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";

import api from "../../services/api";

const SidebarLayout = ({ enqueueSnackbar, isUserAdmin }) => {
  async function handleBoletos() {
    if (window.confirm('Você quer gerar os boletos?')) {
      await api
      .get("/boleto")
      .then(async (response) => {
        enqueueSnackbar("Boletos gerados e enviados.", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      })
      .catch((error) => {
        enqueueSnackbar("Problemas ao gerar boletos!", {
          variant: "error",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
        });
      });
    }
  }

  if (isUserAdmin) {
    return (
      <Sidebar>
        <Sideitem link="/admin/home" icon="home" label="Início" />
        <Sideitem link="/scheduling" icon="event" label="Agendamentos" />
        <Divider />
        <Sideitem link="/admin/client" icon="face" label="Clientes" />
        <Sideitem
          link="/admin/broker"
          icon="account_balance"
          label="Imobiliárias"
        />
        <Divider />
        <Sideitem link="/admin/district" icon="apartment" label="Bairros" />
        <Sideitem link="/admin/city" icon="map" label="Cidades" />
        <Sideitem link="/admin/region" icon="terrain" label="Regiões" />
        <Divider />
        <Sideitem link="/admin/service" icon="camera_alt" label="Serviços" />
        <Sideitem link="/admin/photographer" icon="person" label="Fotógrafos" />
        <Divider />
        <Sideitem link="/logout" icon="exit_to_app" label="Sair" />
        <List>
          <ListItem button onClick={handleBoletos} style={{width: 250,color: "#fff"}}>
            <ListItemIcon style={{color: "#fff"}}>
              <AttachMoneyIcon />
            </ListItemIcon>
            <ListItemText primary={'Gerar boletos'} />
          </ListItem>
        </List>
      </Sidebar>
    );
  } else {
    return (
      <Sidebar>
        <Sideitem link="/home" icon="home" label="Home" />
        <Divider />
        <Sideitem
          link="/scheduling"
          icon="photo_library"
          label="Minhas Sessões"
        />
        <Sideitem link="/contacts" icon="contacts" label="Informações" />
        <Divider />
        <Sideitem link="/profile" icon="person" label="Perfil" />
        <Divider />
        <Sideitem link="/logout" icon="exit_to_app" label="Sair" />
      </Sidebar>
    );
  }
};

const mapStateToProps = (state) => ({
  isUserAdmin: state.isUserAdmin,
});

const withConnect = connect(mapStateToProps, {});

export default compose(withSnackbar, withConnect)(SidebarLayout);
