import SidebarLayout from "./PageLayout/SidebarLayout";
import Container from "./PageLayout/Container";
import Navbar from "./PageLayout/Navbar";

import LoginRequeredRoute from "./Routes/LoginRequeredRoute";
import LogoutRequeredRoute from "./Routes/LogoutRequeredRoute";
import AdminRequeredRoute from "./Routes/AdminRequeredRoute";
import ClientRequeredRoute from "./Routes/ClientRequeredRoute";

import SignIn from "./UserLogin/SignIn";
import Logout from "./UserLogout/Logout";
import LogoutError from "./UserLogout/LogoutError";
import SignUp from "./UserRegister/SignUp";
import ResetPassword from "./UserResetPassword/ResetPassword";

import UserHome from "./User/Home/Home";
import UserScheduling from "./User/Scheduling/Scheduling";
import UserContact from "./User/Contact/Contact";
import UserReports from "./User/Reports/Reports";
import UserProfile from "./User/Profile/Profile";

import AdminCity from "./Admin/City/City";
import AdminRegion from "./Admin/Region/Region";
import AdminDistrict from "./Admin/District/District";
import AdminBroker from "./Admin/Broker/Broker";
import AdminClient from "./Admin/Client/Client";
import AdminPhotographer from "./Admin/Photographer/Photographer";
import AdminHorary from "./Admin/Horary/Horary";
import AdminScheduling from "./Admin/Scheduling/Scheduling";
import AdminHome from "./Admin/Home/Home";
import AdminReports from "./Admin/Reports/Reports";

import GlobalScheduling from "./Global/Scheduling/Scheduling";
import GlobalRescheduling from "./Global/Scheduling/Rescheduling";
import GlobalFileManager from "./Global/FileManager/FileManager";
//import GlobalFileUploader from "./Global/FileManager/FileUploader";

export {
  SidebarLayout,
  Navbar,
  Container,
  LoginRequeredRoute,
  LogoutRequeredRoute,
  AdminRequeredRoute,
  ClientRequeredRoute,
  SignIn,
  Logout,
  LogoutError,
  SignUp,
  AdminCity,
  AdminRegion,
  AdminPhotographer,
  AdminBroker,
  AdminDistrict,
  AdminClient,
  AdminHorary,
  AdminScheduling,
  AdminReports,
  AdminHome,
  GlobalScheduling,
  GlobalRescheduling,
  GlobalFileManager,
  GlobalFileUploader,
  UserHome,
  UserScheduling,
  UserProfile,
  UserContact,
  UserReports,
  ResetPassword
};
