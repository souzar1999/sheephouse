import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const LogoutRequiredRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !rest.isUserLogged ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/home",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const mapStateToProps = state => ({
  isUserLogged: state.isUserLogged,
  isUserAdmin: state.isUserAdmin
});

export default connect(mapStateToProps, {})(LogoutRequiredRoute);
