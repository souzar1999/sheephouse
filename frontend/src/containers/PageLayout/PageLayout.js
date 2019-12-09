import React from "react";
import Divider from "@material-ui/core/Divider";

import { Navbar, Sidebar, Sideitem, Container } from "../../components/";

const PageLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Container>{children}</Container>
      <Sidebar>
        <Sideitem link="/home" icon="home" label="Home" />
        <Divider />
        <Sideitem link="/district" icon="apartment" label="Bairros" />
        <Sideitem link="/city" icon="map" label="Cidades" />
        <Sideitem link="/region" icon="terrain" label="Regiões" />
        <Divider />
        <Sideitem link="/client" icon="face" label="Clientes" />
        <Sideitem link="/broker" icon="account_balance" label="Imobiliárias" />
        <Divider />
        <Sideitem link="/photographer" icon="camera_alt" label="Fotógrafos" />
        <Sideitem link="/horary" icon="timer" label="Horários" />
      </Sidebar>
    </div>
  );
};

export default PageLayout;
