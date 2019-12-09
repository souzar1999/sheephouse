import React, { useEffect } from "react";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";
import { userLogout } from "../../store/actions";

function Logout({ enqueueSnackbar, onUserLogout }) {
  useEffect(() => {
    enqueueSnackbar("Algo errado com seu login!", {
      variant: "info",
      autoHideDuration: 2500,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center"
      }
    });

    enqueueSnackbar("Por favor, acesse novamente!", {
      variant: "info",
      autoHideDuration: 2500,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center"
      }
    });

    onUserLogout();
  }, []);

  return <div></div>;
}

const mapDispatchToProps = dispatch => {
  return {
    onUserLogout: () => {
      dispatch(userLogout());
    }
  };
};

const withConnect = connect(null, mapDispatchToProps);

export default compose(withSnackbar, withConnect)(Logout);
