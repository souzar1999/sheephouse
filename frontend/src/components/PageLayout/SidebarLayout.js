import React from "react";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";

import Sidebar from "./Sidebar";
import Sideitem from "./Sideitem";

const SidebarLayout = ({ isUserAdmin }) => {
  if (isUserAdmin) {
    return (
      <Sidebar>
        <Sideitem link="/admin/home" icon="home" label="Início" />
        <Sideitem link="/scheduling" icon="event" label="Agendamentos" />
        <Sideitem link="/admin/reports" icon="print" label="Relatórios" />
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
        <Sideitem
          link="/admin/photographer"
          icon="camera_alt"
          label="Fotógrafos"
        />
        <Sideitem link="/admin/horary" icon="timer" label="Horários" />
        <Divider />
        <Sideitem link="/logout" icon="exit_to_app" label="Sair" />
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
        <Sideitem link="/reports" icon="print" label="Relatórios" />
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

export default connect(mapStateToProps, {})(SidebarLayout);
