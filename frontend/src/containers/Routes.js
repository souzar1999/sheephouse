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

import UserHome from "./User/Home/Home";

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

        <LoginRequeredRoute path="/home" component={UserHome} />
        <LoginRequeredRoute path="/calendar" component={UserHome} />
        <LoginRequeredRoute path="/sessions" component={UserHome} />
        <LoginRequeredRoute path="/reports" component={UserHome} />
        <LoginRequeredRoute path="/contacts" component={UserHome} />
        <LoginRequeredRoute path="/profile" component={UserHome} />
        <LoginRequeredRoute path="/scheduling/photo" component={UserHome} />
        <LoginRequeredRoute path="/scheduling/drone" component={UserHome} />

        <AdminRequeredRoute path="/admin/home" component={AdminHome} />
        <AdminRequeredRoute path="/admin/city" component={AdminCity} />
        <AdminRequeredRoute path="/admin/broker" component={AdminBroker} />
        <AdminRequeredRoute path="/admin/district" component={AdminDistrict} />
        <AdminRequeredRoute path="/admin/region" component={AdminRegion} />
        <AdminRequeredRoute path="/admin/client" component={AdminClient} />
        <AdminRequeredRoute path="/admin/horary" component={AdminHorary} />
        <AdminRequeredRoute
          path="/admin/photographer"
          component={AdminPhotographer}
        />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}
