import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from "../history";

import {
  LoginRequeredRoute,
  LogoutRequeredRoute,
  AdminRequeredRoute
} from "../components";

import UserLogin from "./UserLogin/UserLogin";
import UserLogout from "./UserLogout/UserLogout";
import UserRegister from "./UserRegister/UserRegister";
import NotFound from "./NotFound/NotFound";

import AdminHome from "./Admin/Home/Home";
import AdminDistrict from "./Admin/District/District";
import AdminCity from "./Admin/City/City";
import AdminRegion from "./Admin/Region/Region";
import AdminClient from "./Admin/Client/Client";
import AdminBroker from "./Admin/Broker/Broker";
import AdminPhotographer from "./Admin/Photographer/Photographer";
import AdminHorary from "./Admin/Horary/Horary";

export default function Routes() {
  return (
    <Router history={history}>
      <Switch>
        <LogoutRequeredRoute path="/" exact component={UserLogin} />
        <LogoutRequeredRoute path="/signup" component={UserRegister} />
        <LoginRequeredRoute path="/logout" component={UserLogout} />
        <AdminRequeredRoute path="/home" component={AdminHome} />
        <AdminRequeredRoute path="/city" component={AdminCity} />
        <AdminRequeredRoute path="/broker" component={AdminBroker} />
        <AdminRequeredRoute path="/district" component={AdminDistrict} />
        <AdminRequeredRoute path="/region" component={AdminRegion} />
        <AdminRequeredRoute path="/client" component={AdminClient} />
        <AdminRequeredRoute
          path="/photographer"
          component={AdminPhotographer}
        />
        <AdminRequeredRoute path="/horary" component={AdminHorary} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}
