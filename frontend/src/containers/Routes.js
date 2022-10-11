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

import UserScheduling from "./User/Scheduling/Scheduling";
import UserContact from "./User/Contact/Contact";
import UserReports from "./User/Reports/Reports";
import UserProfile from "./User/Profile/Profile";

import AdminHome from "./Admin/Home/Home";
import AdminDistrict from "./Admin/District/District";
import AdminCity from "./Admin/City/City";
import AdminCityServices from "./Admin/City/CityServices";
import AdminRegion from "./Admin/Region/Region";
import AdminClient from "./Admin/Client/Client";
import AdminBroker from "./Admin/Broker/Broker";
import AdminPhotographer from "./Admin/Photographer/Photographer";
import AdminPhotographerHorary from "./Admin/Photographer/Horary";
import AdminScheduling from "./Admin/Scheduling/Scheduling";
import AdminEditScheduling from "./Admin/Scheduling/EditScheduling";
import AdminReports from "./Admin/Reports/Reports";
import AdminService from "./Admin/Service/Service";
import AdminBrokerServices from "./Admin/Broker/BrokerServices";

import GlobalScheduling from "./Global/Scheduling/Scheduling";
import GlobalRescheduling from "./Global/Scheduling/Rescheduling";
import GlobalFileManager from "./Global/Scheduling/FileManager";

export default function Routes() {
  return (
    <Router history={history}>
      <PageLayout>
        <Switch>
          <LogoutRequeredRoute path="/" exact component={UserLogin} />
          <LogoutRequeredRoute path="/signup" component={UserRegister} />
          <LogoutRequeredRoute path="/reset" component={UserResetPassword} />
          <LogoutRequeredRoute path="/scheduling" component={UserScheduling} />
          <LoginRequeredRoute path="/logout" component={UserLogout} />
          <LoginRequeredRoute path="/logout/e" component={UserLogoutError} />

          <ClientRequeredRoute path="/reports" component={UserReports} />
          <ClientRequeredRoute path="/contacts" component={UserContact} />
          <ClientRequeredRoute path="/profile" component={UserProfile} />
          <ClientRequeredRoute path="/home" component={UserScheduling} />

          <AdminRequeredRoute path="/admin/home" component={AdminHome} />
          <AdminRequeredRoute
            path="/admin/city/:city_id/services"
            component={AdminCityServices}
          />
          <AdminRequeredRoute exact path="/admin/city" component={AdminCity} />
          <AdminRequeredRoute
            path="/admin/broker/:broker_id/services"
            component={AdminBrokerServices}
          />
          <AdminRequeredRoute
            exact
            path="/admin/broker"
            component={AdminBroker}
          />
          <AdminRequeredRoute
            path="/admin/district"
            component={AdminDistrict}
          />
          <AdminRequeredRoute path="/admin/region" component={AdminRegion} />
          <AdminRequeredRoute path="/admin/client" component={AdminClient} />
          <AdminRequeredRoute path="/admin/reports" component={AdminReports} />
          <AdminRequeredRoute
            path="/admin/scheduling"
            component={AdminScheduling}
          />
          <AdminRequeredRoute
            path="/admin/edit/scheduling/:id"
            component={AdminEditScheduling}
          />
          <AdminRequeredRoute
            path="/admin/photographer/:photographer_id/horary"
            component={AdminPhotographerHorary}
          />
          <AdminRequeredRoute
            path="/admin/photographer"
            component={AdminPhotographer}
          />
          <AdminRequeredRoute path="/admin/service" component={AdminService} />

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
            path="/filemanager/:id"
            component={GlobalFileManager}
          />
          <Route component={NotFound} />
        </Switch>
      </PageLayout>
    </Router>
  );
}
