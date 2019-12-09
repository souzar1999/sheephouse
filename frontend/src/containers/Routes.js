import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from "../history";

import { LoginRequeredRoute, LogoutRequeredRoute } from "../components";

import UserLogin from "./UserLogin/UserLogin";
import UserLogout from "./UserLogout/UserLogout";
import UserRegister from "./UserRegister/UserRegister";
import Home from "./Home/Home";
import NotFound from "./NotFound/NotFound";
import District from "./District/District";
import City from "./City/City";
import Region from "./Region/Region";
import Client from "./Client/Client";
import Broker from "./Broker/Broker";
import Photographer from "./Photographer/Photographer";
import Horary from "./Horary/Horary";

export default function Routes() {
  return (
    <Router history={history}>
      <Switch>
        <LogoutRequeredRoute path="/" exact component={UserLogin} />
        <LogoutRequeredRoute path="/signup" component={UserRegister} />
        <LoginRequeredRoute path="/home" component={Home} />
        <LoginRequeredRoute path="/city" component={City} />
        <LoginRequeredRoute path="/broker" component={Broker} />
        <LoginRequeredRoute path="/district" component={District} />
        <LoginRequeredRoute path="/region" component={Region} />
        <LoginRequeredRoute path="/client" component={Client} />
        <LoginRequeredRoute path="/photographer" component={Photographer} />
        <LoginRequeredRoute path="/horary" component={Horary} />
        <LoginRequeredRoute path="/logout" component={UserLogout} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}
