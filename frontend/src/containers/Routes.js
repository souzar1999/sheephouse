import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from "../history";

import PageLayout from "./PageLayout/PageLayout";

import {
  LoginRequeredRoute,
  LogoutRequeredRoute,
  AdminRequeredRoute,
  ClientRequeredRoute,
} from "../components";

import UserLogin from "./UserLogin/UserLogin";
import UserLogout from "./UserLogout/UserLogout";
import UserLogoutError from "./UserLogout/UserLogoutError";
import UserRegister from "./UserRegister/UserRegister";
import UserResetPassword from "./UserResetPassword/UserResetPassword";
import UserDownload from "./UserDownload/UserDownload";

import NotFound from "./NotFound/NotFound";

import UserHome from "./User/Home/Home";
import UserScheduling from "./User/Scheduling/Scheduling";
import UserContact from "./User/Contact/Contact";
import UserReports from "./User/Reports/Reports";
import UserProfile from "./User/Profile/Profile";

import AdminHome from "./Admin/Home/Home";
import AdminDistrict from "./Admin/District/District";
import AdminCity from "./Admin/City/City";
import AdminRegion from "./Admin/Region/Region";
import AdminClient from "./Admin/Client/Client";
import AdminBroker from "./Admin/Broker/Broker";
import AdminPhotographer from "./Admin/Photographer/Photographer";
import AdminHorary from "./Admin/Horary/Horary";
import AdminScheduling from "./Admin/Scheduling/Scheduling";
import AdminReports from "./Admin/Reports/Reports";

import GlobalScheduling from "./Global/Scheduling/Scheduling";
import GlobalRescheduling from "./Global/Scheduling/Rescheduling";
import GlobalFileManager from "./Global/Scheduling/FileManager";
import GlobalFileUploader from "./Global/Scheduling/FileUploader";

export default function Routes() {
  return (
    <Router history={history}>
      <PageLayout>
        <Switch>
          <LogoutRequeredRoute path="/" exact component={UserLogin} />
          <LogoutRequeredRoute path="/signup" component={UserRegister} />
          <LogoutRequeredRoute path="/reset" component={UserResetPassword} />
          <LoginRequeredRoute path="/logout" component={UserLogout} />
          <LoginRequeredRoute path="/logout/e" component={UserLogoutError} />

          <ClientRequeredRoute path="/home" component={UserHome} />
          <ClientRequeredRoute path="/reports" component={UserReports} />
          <ClientRequeredRoute path="/contacts" component={UserContact} />
          <ClientRequeredRoute path="/profile" component={UserProfile} />
          <ClientRequeredRoute
            path="/scheduling/photo"
            component={UserScheduling}
          />

          <AdminRequeredRoute path="/admin/home" component={AdminHome} />
          <AdminRequeredRoute path="/admin/city" component={AdminCity} />
          <AdminRequeredRoute path="/admin/broker" component={AdminBroker} />
          <AdminRequeredRoute
            path="/admin/district"
            component={AdminDistrict}
          />
          <AdminRequeredRoute path="/admin/region" component={AdminRegion} />
          <AdminRequeredRoute path="/admin/client" component={AdminClient} />
          <AdminRequeredRoute path="/admin/horary" component={AdminHorary} />
          <AdminRequeredRoute path="/admin/reports" component={AdminReports} />
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
            path="/filemanager/:uploadType/:folderName/:dbCode"
            component={GlobalFileManager}
          />
          <LoginRequeredRoute
            exact
            path="/fileuploader/:uploadType/:folderName/:dbCode"
            component={GlobalFileUploader}
          />

          <Route
            path="/download/:uploadType/:folderName/:dbCode"
            component={UserDownload}
          />

          <Route component={NotFound} />
        </Switch>
      </PageLayout>
    </Router>
  );
}
