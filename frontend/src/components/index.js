import SidebarLayout from "./PageLayout/SidebarLayout";
import Container from "./PageLayout/Container";
import Navbar from "./PageLayout/Navbar";
import Body from "./PageLayout/Body";

import LoginRequeredRoute from "./Routes/LoginRequeredRoute";
import LogoutRequeredRoute from "./Routes/LogoutRequeredRoute";
import AdminRequeredRoute from "./Routes/AdminRequeredRoute";
import ClientRequeredRoute from "./Routes/ClientRequeredRoute";

import SignIn from "./UserLogin/SignIn";
import Logout from "./UserLogout/Logout";
import SignUp from "./UserRegister/SignUp";

import UserClient from "./User/Client/Client";
import UserHome from "./User/Home/Home";
import UserPhoto from "./User/Photo/Photo";

import AdminCity from "./Admin/City/City";
import AdminRegion from "./Admin/Region/Region";
import AdminDistrict from "./Admin/District/District";
import AdminBroker from "./Admin/Broker/Broker";
import AdminClient from "./Admin/Client/Client";
import AdminPhotographer from "./Admin/Photographer/Photographer";
import AdminHorary from "./Admin/Horary/Horary";

export {
  SidebarLayout,
  Navbar,
  Container,
  Body,
  LoginRequeredRoute,
  LogoutRequeredRoute,
  AdminRequeredRoute,
  ClientRequeredRoute,
  SignIn,
  Logout,
  SignUp,
  AdminCity,
  AdminRegion,
  AdminPhotographer,
  AdminBroker,
  AdminDistrict,
  AdminClient,
  AdminHorary,
  UserClient,
  UserHome,
  UserPhoto
};
