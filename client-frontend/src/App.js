import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ClientProtectedRoute from "./components/Routes/ClientProtectedRoute";
import ActivityDetailsPage from "./containers/ActivityDetailsPage/ActivityDetailsPage";
import AccountDetails from "./containers/Client/Account/AccountDetails";
import PasswordChange from "./containers/Client/Account/PasswordChange";
import Privacy from "./containers/Client/Account/Privacy";
import ProfilePicture from "./containers/Client/Account/ProfilePicture";
import VerifyEmail from "./containers/Client/Account/VerifyEmail";
import MyBookmarks from "./containers/Client/Bookmark/MyBookmarks";
import CartPage from "./containers/Client/CartPage";
import CheckoutPage from "./containers/Client/CheckoutPage";
import RegisterPage from "./containers/Client/RegisterPage";
import ShopPage from "./containers/Client/ShopPage";
import HomePage from "./containers/HomePage";
import LoginPage from "./containers/LoginPage";
import SocketConnection from "./utils/SocketConnection";
import MyBookings from "./containers/Client/Booking/MyBookings";
import MyBadges from "./containers/Client/Badge/MyBadges";
import BookingsDetails from "./containers/Client/Booking/BookingsDetails";
import ClientDetails from "./containers/Client/Badge/ClientDetails";

import VendorProtectedRoute from "./components/Routes/VendorProtectedRoute";
import VendorDetails from "./containers/Client/Activity/VendorDetails";
import ForgotPassword from "./containers/Client/Password/ClientForgotPassword";
import ResetPassword from "./containers/Client/Password/ResetPassword";
import ErrorPage from "./containers/ErrorPage";
import AccountDetailsVendor from "./containers/Vendor/AccountDetailsVendor";
import ActivitiesPage from "./containers/Vendor/Activity/ActivitiesPage";
import CreateActivityPage from "./containers/Vendor/Activity/CreateActivityPage";
import EditActivityDraftPage from "./containers/Vendor/Activity/EditActivityDraftPage";
import BlockoutDashboard from "./containers/Vendor/Blockout/BlockoutDashboard";
import BlockoutMultipleActivities from "./containers/Vendor/Blockout/BlockoutMultipleActivities";
import BlockoutSingleActivity from "./containers/Vendor/Blockout/BlockoutSingleActivity";
import FillSurvey from "./containers/Client/Survey/FillSurvey";
import ViewSurvey from "./containers/Client/Survey/ViewSurvey";
import BookingsPage from "./containers/Vendor/Booking/BookingsPage";
import VendorResetPassword from "./containers/Vendor/Password/ResetPassword";
import VendorForgotPassword from "./containers/Vendor/Password/VendorForgotPassword";
import PasswordChangeVendor from "./containers/Vendor/PasswordChangeVendor";
import PrivacyVendor from "./containers/Vendor/PrivacyVendor";
import ProfilePictureVendor from "./containers/Vendor/ProfilePictureVendor";
import VendorRegisterPage from "./containers/Vendor/VendorRegisterPage";
import VerifyEmailVendor from "./containers/Vendor/VerifyEmailVendor";
import useClientStore from "./zustand/ClientStore";
import useVendorStore from "./zustand/VendorStore";
import PendingSurveys from "./containers/Client/Survey/PendingSurveys";
import ChatPage from "./containers/ChatPage";
import DashboardPage from "./containers/Vendor/Dashboard/DashboardPage";
import NotificationPage from "./containers/NotificationPage";
import LeaderBoardMainPage from "./containers/Client/Leaderboard/LeaderBoardMainPage";

function App() {
   const { isLoading, clientError, login } = useClientStore();
   const { isLoadingVendor, vendorError, loginVendor } = useVendorStore();
   return (
      <div>
         <SocketConnection />
         <Layout>
            <Routes>
               <Route path="/" element={<HomePage />} />
               <Route
                  path="/settings"
                  element={
                     <ClientProtectedRoute>
                        <Navigate to="/settings/profile" />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  path="/settings/profile"
                  element={
                     <ClientProtectedRoute>
                        <AccountDetails />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  path="/settings/picture"
                  element={
                     <ClientProtectedRoute>
                        <ProfilePicture />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  path="/settings/privacy"
                  element={
                     <ClientProtectedRoute>
                        <Privacy />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  path="/settings/password"
                  element={
                     <ClientProtectedRoute>
                        <PasswordChange />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  path="/client/verifyEmail"
                  element={
                     <ClientProtectedRoute>
                        <VerifyEmail />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  path="/client/verifyEmail/:token"
                  element={
                     <ClientProtectedRoute>
                        <VerifyEmail />
                     </ClientProtectedRoute>
                  }
               />

               <Route
                  path="/bookmarks"
                  element={
                     <ClientProtectedRoute>
                        <MyBookmarks />
                     </ClientProtectedRoute>
                  }
               />

               <Route
                  path="/cart"
                  element={
                     <ClientProtectedRoute>
                        <CartPage />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  path="/shop"
                  element={
                     <ClientProtectedRoute>
                        <ShopPage />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  path="/shop/activity/:activityId"
                  element={
                     <ClientProtectedRoute>
                        <ActivityDetailsPage />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  exact
                  path="/shop/vendor/:id"
                  element={
                     <ClientProtectedRoute>
                        <VendorDetails />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  exact
                  path="/cart/checkout"
                  element={
                     <ClientProtectedRoute>
                        <CheckoutPage />
                     </ClientProtectedRoute>
                  }
               />

               <Route
                  exact
                  path="/booking/:bookingId/survey/edit"
                  element={
                     <ClientProtectedRoute>
                        <FillSurvey />
                     </ClientProtectedRoute>
                  }
               />

               <Route
                  exact
                  path="/booking/:bookingId/survey/view"
                  element={
                     <ClientProtectedRoute>
                        <ViewSurvey />
                     </ClientProtectedRoute>
                  }
               />

               <Route
                  exact
                  path="/surveys"
                  element={
                     <ClientProtectedRoute>
                        <PendingSurveys />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  exact
                  path="/bookings"
                  element={
                     <ClientProtectedRoute>
                        <MyBookings />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  exact
                  path="/booking/:bookingId"
                  element={
                     <ClientProtectedRoute>
                        <BookingsDetails />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  exact
                  path="/myBadges"
                  element={
                     <ClientProtectedRoute>
                        <MyBadges />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  exact
                  path="/client/:id"
                  element={
                     <ClientProtectedRoute>
                        <ClientDetails />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  path="/login"
                  element={
                     <LoginPage
                        loading={isLoading}
                        error={clientError}
                        title="Client Login"
                        registerLink="/register"
                        forgotPasswordLink="/client/forgotPassword"
                        loginMethod={login}
                     />
                  }
               />
               <Route path="/register" element={<RegisterPage />} />
               <Route
                  exact
                  path="client/resetPassword"
                  element={<ResetPassword />}
               />
               <Route
                  exact
                  path="/client/forgotPassword"
                  element={<ForgotPassword />}
               />
               <Route
                  exact
                  path="/client/chats"
                  element={
                     <ClientProtectedRoute>
                        <ChatPage />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  exact
                  path="/client/notifications"
                  element={
                     <ClientProtectedRoute>
                        <NotificationPage />
                     </ClientProtectedRoute>
                  }
               />
               <Route
                  exact
                  path="/client/leaderboard"
                  element={
                     //  <ClientProtectedRoute>
                     <LeaderBoardMainPage />
                     //  </ClientProtectedRoute>
                  }
               />
               {/* Vendor routes */}
               <Route
                  path="/vendor/login"
                  element={
                     <LoginPage
                        loading={isLoadingVendor}
                        error={vendorError}
                        title="Vendor Login"
                        registerLink="/vendor/register"
                        forgotPasswordLink="/vendor/forgotPassword"
                        loginMethod={loginVendor}
                     />
                  }
               />
               <Route
                  path="/vendor/register"
                  element={<VendorRegisterPage />}
               />
               <Route path="/vendor/dashboard" element={<DashboardPage />} />
               <Route path="/error" element={<ErrorPage />} />
               <Route
                  path="/vendor/activities"
                  element={
                     <VendorProtectedRoute>
                        <ActivitiesPage />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  path="/vendor/bookings"
                  element={
                     <VendorProtectedRoute>
                        <BookingsPage />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  path="/vendor/createActivity"
                  element={
                     <VendorProtectedRoute>
                        <CreateActivityPage />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  path="/vendor/editActivityDraft/:activityId"
                  element={
                     <VendorProtectedRoute>
                        <EditActivityDraftPage />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  path="/vendor/settings"
                  element={
                     <VendorProtectedRoute>
                        <Navigate to="/vendor/settings/profile" />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  path="/vendor/settings/profile"
                  element={
                     <VendorProtectedRoute>
                        <AccountDetailsVendor />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  path="/vendor/settings/picture"
                  element={
                     <VendorProtectedRoute>
                        <ProfilePictureVendor />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  path="/vendor/settings/password"
                  element={
                     <VendorProtectedRoute>
                        <PasswordChangeVendor />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  path="/vendor/verifyEmail/:token"
                  element={
                     <VendorProtectedRoute>
                        <VerifyEmailVendor />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  path="/vendor/verifyEmail"
                  element={
                     <VendorProtectedRoute>
                        <VerifyEmailVendor />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  path="/vendor/settings/termsAndConditons"
                  element={
                     <VendorProtectedRoute>
                        <PrivacyVendor />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  exact
                  path="/vendor/forgotPassword"
                  element={<VendorForgotPassword />}
               />
               <Route
                  exact
                  path="/vendor/resetPassword"
                  element={<VendorResetPassword />}
               />
               <Route
                  exact
                  path="/vendor/blockout"
                  element={
                     <VendorProtectedRoute>
                        <BlockoutDashboard />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  exact
                  path="/vendor/activity/:activityId/blockout"
                  element={
                     <VendorProtectedRoute>
                        <BlockoutSingleActivity />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  exact
                  path="/vendor/blockout/create/mass"
                  element={
                     <VendorProtectedRoute>
                        <BlockoutMultipleActivities />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  exact
                  path="/vendor/chats"
                  element={
                     <VendorProtectedRoute>
                        <ChatPage />
                     </VendorProtectedRoute>
                  }
               />
               <Route
                  exact
                  path="/vendor/notifications"
                  element={
                     <VendorProtectedRoute>
                        <NotificationPage />
                     </VendorProtectedRoute>
                  }
               />
            </Routes>
         </Layout>
      </div>
   );
}

export default App;
