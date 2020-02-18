import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const LoginRequiredRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      rest.isUserLogged && rest.clientCode ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/logout",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const mapStateToProps = state => ({
  isUserLogged: state.isUserLogged,
  clientCode: state.clientCode
});

export default connect(mapStateToProps, {})(LoginRequiredRoute);
