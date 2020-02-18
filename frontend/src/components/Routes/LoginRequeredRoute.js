import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const LoginRequiredRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      rest.isUserLogged ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/admin/home ",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const mapStateToProps = state => ({
  isUserLogged: state.isUserLogged
});

export default connect(mapStateToProps, {})(LoginRequiredRoute);
