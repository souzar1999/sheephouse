import React from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { closeMenu } from "../../store/actions";

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: "#3f51b5"
  }
}));

const TemporaryDrawer = ({
  children,
  isMenuOpen,
  isUserLogged,
  onCloseMenu
}) => {
  const classes = useStyles();

  if (isUserLogged) {
    return (
      <div>
        <Drawer
          classes={{ paper: classes.paper }}
          open={isMenuOpen}
          onClose={onCloseMenu}
        >
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
