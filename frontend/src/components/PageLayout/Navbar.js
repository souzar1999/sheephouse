import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";
import { openMenu, userLogout } from "../../store/actions";
import history from "../../history";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  })
);

const Navbar = ({
  isUserLogged,
  onOpenMenu,
  onUserLogout,
  enqueueSnackbar
}) => {
  const classes = useStyles();

  if (isUserLogged) {
    return (
      <div className={classes.root}>
        <AppBar color="primary" position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => {
                onOpenMenu();
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Sheephouse
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => {
                onUserLogout();
                localStorage.removeItem("userToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userPass");
                enqueueSnackbar("Usuário desconectado!", {
                  variant: "success",
                  autoHideDuration: 5000,
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "center"
                  }
                });
              }}
            >
              <ExitToAppIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  } else {
    return <></>;
  }
};

const mapStateToProps = state => ({
  isUserLogged: state.isUserLogged
});

const mapDispatchToProps = dispatch => {
  return {
    onOpenMenu: () => dispatch(openMenu()),
    onUserLogout: () => dispatch(userLogout())
  };
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withSnackbar, withConnect)(Navbar);
