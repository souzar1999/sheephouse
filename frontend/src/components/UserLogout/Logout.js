import React, { useEffect } from "react";
import { withSnackbar } from "notistack";
import { compose } from "redux";

import { connect } from "react-redux";
import { userLogout } from "../../store/actions";

import history from "../../history";

function Logout({ enqueueSnackbar, onUserLogout }) {
  useEffect(() => {
    onUserLogout();
    history.push("/");
  }, [enqueueSnackbar, onUserLogout]);

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
