import React from "react";

import { Navbar, Container, SidebarLayout, Body } from "../../components/";

const PageLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Body>
        <Container>{children}</Container>
      </Body>
      <SidebarLayout />
    </>
  );
};

export default PageLayout;
