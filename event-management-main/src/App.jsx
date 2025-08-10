import { BrowserRouter as Router,Routes,Route,useLocation,Navigate,} from "react-router-dom";
import "./App.css";

//public pages imports
import NavBar from "./components/NavBar";
import Signin from "./components/Organizer/Signin";
import Home from "./components/Home";

//vendor pages imports
import VendorSignin from "./components/Vendor/VendorSignin";
import VendorSignUp from "./components/Vendor/VendorSignUp";
import VendorDash from "./components/Vendor/VendorDash";
import VendorProfile from "./components/Vendor/VendorProfile";
import VendorSettings from "./components/Vendor/VendorSettings";
import VendorOrders from "./components/Vendor/VendorOrders";
import VLogout from "./components/Vendor/VLogout";
import VendorEventReq from "./components/Vendor/VendorEventReq";

//user pages imports
import UserSignin from "./components/User/UserSignin";
import UserSignUp from "./components/User/UserSignUp";
import ULogout from "./components/User/ULogout";
import Messages from "./components/User/Messages";
import UserProfile from "./components/User/UserProfile";
import UserBookings from "./components/User/UserBookings";
import UserSettings from "./components/User/UserSettings";
import CreateEvent from "./components/User/CreateEvent";
import UserhomePage from "./components/User/UserhomePage";

//organizer pages imports
import EventDetails from "./components/Organizer/EventDetails";
import ThemeDetails from "./components/ThemeDetails";
import UpdateCatererModal from "./components/Organizer/UpdateCatererModal";
import AddCateors from "./components/Organizer/AddCateors";
import Organizers from "./components/Organizers";
import OrgDash from "./components/Organizer/OrgDash";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Organizer/Profile";
import Settings from "./components/Organizer/Settings";
import NotFound from "./components/NotFound";
import Caterers from "./components/Organizer/Caterers";
import Photographers from "./components/Organizer/Photographers";
import Venues from "./components/Organizer/Venues";
import EventRequests from "./components/Organizer/EventRequests";
import Logout from "./components/Organizer/Logout";
import RegisterEM from "./components/Organizer/RegisterEM";



// ✅ Organizer Password Recovery Components
import OrganizerForgotPassword from "./components/Organizer/OrganizerForgotPassword";
import OrganizerResetPassword from "./components/Organizer/OrganizerResetPassword";
// import VendorForgotPassword from "./components/Vendor/VendorForgotPassword";
// import VendorResetPassword from "./components/Vendor/VendorResetPassword";

import UserForgotPassword from "./components/User/UserForgotPassword";
import UserResetPassword from "./components/User/UserResetPassword";


function App() {
  const location = useLocation();

  return (
    <>
      {/* Show NavBar unless user is on /Dashboard or its subpaths */}
      {!["/Dashboard", "/My-Dashboard", "/index","/home"].some((path) =>
        location.pathname.startsWith(path)
      ) && <NavBar />}


      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/vendor-signin" element={<VendorSignin />} />
        <Route path="/vendor-signup" element={<VendorSignUp />} />
        <Route path="/user-signin" element={<UserSignin />} />
        <Route path="/user-signup" element={<UserSignUp />} />
        <Route path="/organizer-signin" element={<Signin />} />
        <Route path="/register" element={<RegisterEM />} />
        <Route path="/updateCatererModal" element={<UpdateCatererModal />} />
        <Route path="/addCateors" element={<AddCateors />} />
        <Route path="/addCateors" element={<AddCateors />} />
        

        {/* ✅ Organizer Forgot/Reset Password Routes */}
        <Route path="/organizer/forgot-password" element={<OrganizerForgotPassword />} />
        <Route path="/organizer/reset-password" element={<OrganizerResetPassword />} />

        {/* ✅ Redirect old /forgot-password to new organizer route */}
        <Route path="/forgot-password" element={<Navigate to="/organizer/forgot-password" />} />
        <Route path="/forgot-password" element={<Navigate to="/organizer/forgot-password" />} />

       <Route path="/Uforgot-password" element={<Navigate to="/user/forgot-password" />} />
       
       {/* <Route path="/Vforgot-password" element={<Navigate to="/vendor/forgot-password" />} />

       <Route path="/vendor/forgot-password" element={<VendorForgotPassword />} />
        <Route path="/vendor/reset-password" element={<VendorResetPassword />} /> */}

         <Route path="/user/forgot-password" element={<UserForgotPassword />} />
        <Route path="/user/reset-password" element={<UserResetPassword />} />

        {/* Organizer Dashboard */}
        <Route path="/Dashboard" element={<ProtectedRoute />}>
          <Route index element={<OrgDash />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="caterers" element={<Caterers />} />
          <Route path="photographers" element={<Photographers />} />
          <Route path="venues" element={<Venues />} />
          <Route path="event-requests" element={<EventRequests />} />
          <Route path="logout" element={<Logout />} />
          <Route path="events" element={<EventDetails />} />
        </Route>

        {/* Vendor Dashboard */}
        <Route path="/My-Dashboard" element={<ProtectedRoute />}>
          <Route index element={<VendorDash />} />
          <Route path="requests" element={<VendorEventReq />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="settings" element={<VendorSettings />} />
          <Route path="logout" element={<VLogout />} />
          <Route path="signin" element={<VendorSignin />} />
          <Route path="vendordash" element={<VendorDash />} />
        </Route>

        {/* User Dashboard */}
        <Route path="home" element={<ProtectedRoute />}>
          <Route index element={<UserhomePage />} />
          <Route path="Profile" element={<UserProfile />} />
          <Route path="Messages" element={<Messages />} />
          <Route path="Organizers" element={<Organizers />} />
          <Route path="Logout" element={<ULogout />} />
          <Route path="Bookings" element={<UserBookings />} />
          <Route path="Settings" element={<UserSettings />} />
          <Route path="create-event" element={<CreateEvent />} />
          {/* <Route path="home" element={<UserhomePage />}/> */}
        </Route>

        <Route path="/themes/:themeName" element={<ThemeDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;