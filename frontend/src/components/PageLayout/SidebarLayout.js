import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import Sidebar from "./Sidebar";
import Sideitem from "./Sideitem";

import api from "../../services/api";

const SidebarLayout = ({ isUserAdmin }) => {
  const [maintenance, setMaintenance] = useState({});

  useEffect(() => {
    handleLoad();
  }, []);

  async function handleLoad() {
    await api.get("/configuration/1").then((response) => {
      setMaintenance(response.data[0].maintenance);
    });
  }

  async function handleMaintenance() {
    setMaintenance(!maintenance);

    await api
      .put(`/configuration/1`, { maintenance: !maintenance })
      .then((response) => {
        handleLoad();
      });
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
          <ListItem>
            <FormControlLabel
              control={
                <Switch
                  checked={maintenance}
                  onChange={handleMaintenance}
                  name="maintenance"
                  defaultChecked
                  color="default"
                  inputProps={{ "aria-label": "checkbox with default color" }}
                />
              }
              style={{ color: "#fff" }}
              label="Manutenção"
            />
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

export default connect(mapStateToProps, {})(SidebarLayout);
