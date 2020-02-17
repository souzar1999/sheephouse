import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from "../history";

import {
  LoginRequeredRoute,
  LogoutRequeredRoute,
  AdminRequeredRoute,
  ClientRequeredRoute
} from "../components";

import UserLogin from "./UserLogin/UserLogin";
import UserLogout from "./UserLogout/UserLogout";
import UserLogoutError from "./UserLogout/UserLogoutError";
import UserRegister from "./UserRegister/UserRegister";
import UserResetPassword from "./UserResetPassword/UserResetPassword";

import NotFound from "./NotFound/NotFound";

import UserHome from "./User/Home/Home";
import UserScheduling from "./User/Scheduling/Scheduling";
import UserClient from "./User/Client/Client";
import UserContact from "./User/Contact/Contact";

import AdminHome from "./Admin/Home/Home";
import AdminDistrict from "./Admin/District/District";
import AdminCity from "./Admin/City/City";
import AdminRegion from "./Admin/Region/Region";
import AdminClient from "./Admin/Client/Client";
import AdminBroker from "./Admin/Broker/Broker";
import AdminPhotographer from "./Admin/Photographer/Photographer";
import AdminHorary from "./Admin/Horary/Horary";
import AdminScheduling from "./Admin/Scheduling/Scheduling";

import GlobalScheduling from "./Global/Scheduling/Scheduling";
import GlobalRescheduling from "./Global/Scheduling/Rescheduling";
import GlobalFileManager from "./Global/Scheduling/FileManager";
import GlobalFileUploader from "./Global/Scheduling/FileUploader";

export default function Routes() {
  return (
    <Router history={history}>
      <Switch>
        <LogoutRequeredRoute path="/" exact component={UserLogin} />
        <LogoutRequeredRoute path="/signup" component={UserRegister} />
        <LogoutRequeredRoute path="/reset" component={UserResetPassword} />
        <LoginRequeredRoute path="/logout" component={UserLogout} />
        <LoginRequeredRoute path="/logout/e" component={UserLogoutError} />

        <LoginRequeredRoute path="/user" component={UserClient} />

        <ClientRequeredRoute path="/home" component={UserHome} />
        <ClientRequeredRoute path="/calendar" component={UserHome} />
        <ClientRequeredRoute path="/sessions" component={UserHome} />
        <ClientRequeredRoute path="/reports" component={UserHome} />
        <ClientRequeredRoute path="/contacts" component={UserContact} />
        <ClientRequeredRoute path="/profile" component={UserHome} />
        <ClientRequeredRoute
          path="/scheduling/photo"
          component={UserScheduling}
        />

        <AdminRequeredRoute path="/admin/home" component={AdminHome} />
        <AdminRequeredRoute path="/admin/city" component={AdminCity} />
        <AdminRequeredRoute path="/admin/broker" component={AdminBroker} />
        <AdminRequeredRoute path="/admin/district" component={AdminDistrict} />
        <AdminRequeredRoute path="/admin/region" component={AdminRegion} />
        <AdminRequeredRoute path="/admin/client" component={AdminClient} />
        <AdminRequeredRoute path="/admin/horary" component={AdminHorary} />
        <AdminRequeredRoute
          path="/admin/scheduling"
          component={AdminScheduling}
        />
        <AdminRequeredRoute
          path="/admin/photographer"
          component={AdminPhotographer}
        />

        <LoginRequeredRoute
          exact
          path="/scheduling"
          component={GlobalScheduling}
        />
        <LoginRequeredRoute
          exact
          path="/scheduling/:id"
          component={GlobalRescheduling}
        />
        <LoginRequeredRoute
          exact
          path="/filemanager/:uploadType/:folderName"
          component={GlobalFileManager}
        />
        <LoginRequeredRoute
          exact
          path="/fileuploader/:uploadType/:folderName"
          component={GlobalFileUploader}
        />

        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}
