import React from "react";

import { Navbar, Container, SidebarLayout } from "../../components/";

const PageLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Container>{children}</Container>
      <SidebarLayout />
    </>
  );
};

export default PageLayout;
