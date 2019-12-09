import React from "react";
import Drawer from "@material-ui/core/Drawer";

import { connect } from "react-redux";
import { closeMenu } from "../../store/actions";

const TemporaryDrawer = ({
  children,
  isMenuOpen,
  isUserLogged,
  onCloseMenu
}) => {
  if (isUserLogged) {
    return (
      <div>
        <Drawer open={isMenuOpen} onClose={onCloseMenu}>
          {children}
        </Drawer>
      </div>
    );
  } else {
    return <></>;
  }
};

const mapStateToProps = state => ({
  isMenuOpen: state.isMenuOpen,
  isUserLogged: state.isUserLogged
});

const mapDispatchToProps = {
  onCloseMenu: closeMenu
};

export default connect(mapStateToProps, mapDispatchToProps)(TemporaryDrawer);
