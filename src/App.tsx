import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // 1. Import the Toaster
import Home from "./Pages/Home";
import LoginPage from "./Pages/Login";
import SearchResultsPage from "./Pages/searchResultsPage";
import HostelDetailsPage from "./Pages/HostelPageDetails";
import CampusDestinationPage from "./Pages/CampusDestinationPage";
import { AdminDashBoard } from "./Pages/AdminDashBoard";
import HostelManager from "./DashBoards/Admin-Dashboard/HostelManger";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import RoomManager from "./DashBoards/Admin-Dashboard/RoomManager";
import MediaManager from "./DashBoards/Admin-Dashboard/MediaManager";
import AmenityManager from "./DashBoards/Admin-Dashboard/AmenityManager";
import ReviewManager from "./DashBoards/Admin-Dashboard/ReviewsManager";
import ManageUsers from "./DashBoards/Admin-Dashboard/UserManager";
import ResetPassword from "./Pages/ResetPassword";
import ForgotPassword from "./Pages/ForgotPassword";
import RegisterPage from "./Pages/RegisterPage";
import VerifyEmail from "./Pages/Verify-Email";

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/register',
      element: <RegisterPage />
    },
    {
      path: '/verify-email',
      element: <VerifyEmail />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/reset-password',
      element: <ResetPassword />
    },
    {
      path: '/hostels',
      element: <SearchResultsPage />
    },
    {
      path: '/hostels/:id',
      element: <HostelDetailsPage />
    },
    {
      path: '/campus/:campusName',
      element: <CampusDestinationPage />
    },
    {
      path: '/admin-dashboard',
      element: (
        <ProtectedRoutes>
          <AdminDashBoard />
        </ProtectedRoutes>
      ),
      children: [
        { path: "manage-hostels", element: <HostelManager /> },
        { path: "manage-rooms", element: <RoomManager /> },
        { path: "product-media", element: <MediaManager /> },
        { path: "manage-amenities", element: <AmenityManager /> },
        { path: "manage-reviews", element: <ReviewManager /> },
        { path: "manage-users", element: <ManageUsers /> },
      ],
    },
  ]);

  return (
    <>
      {/* 2. Place Toaster here so it works on all pages */}
      {/* <Toaster 
        position="top-center" 
        reverseOrder={false} 
        gutter={8}
        toastOptions={{
          duration: 4000,
        }}
      /> */}
      <RouterProvider router={router} />
    </>
  );
};

export default App;