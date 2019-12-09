import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const AdminRequeredRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      rest.isUserLogged && rest.isUserAdmin ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
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

export default connect(mapStateToProps, {})(AdminRequeredRoute);
