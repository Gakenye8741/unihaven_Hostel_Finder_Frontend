import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
import ApplyOwnerPage from "./Pages/ApplyHostelOwner";
import AdminVerificationPanel from "./DashBoards/Admin-Dashboard/AdminVerificationPanel";
import NotFound from "./Pages/NotFound"; 
import SearchByAddress from "./Pages/SearchByAddress";
import CampusHub from "./Pages/CampusMap";
import About from "./Pages/About";
import SafetyTrust from "./Pages/Saftey";
import FAQ from "./Pages/Faq";
import Contact from "./Pages/Contact";
import Legal from "./Pages/Legal";
import MyHostels from "./DashBoards/Owner DashBoard/MyHostels";
import { OwnerDashBoard } from "./Pages/OwnerDashboard";
import OwnerRoomManager from "./DashBoards/Owner DashBoard/HostelManager";
import OwnerMediaManager from "./DashBoards/Owner DashBoard/OwnerMediaManager";
import OwnerAmenityManager from "./DashBoards/Owner DashBoard/OwnerAmenityManager";
import OwnerReviewManager from "./DashBoards/Owner DashBoard/OwnerReveiwMnager";
import UserProfileManager from "./DashBoards/Owner DashBoard/OwnerProfile";


const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <NotFound />,
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
      path: '/ApplyHostelOwner',
      element: <ApplyOwnerPage />
    },
   {
      path: '/search',
      element: <SearchByAddress />
    },
    {
      path: '/map',
      element: <CampusHub />
    },
    {
      path: '/about',
      element: <About />
    },
      {
      path: '/safety',
      element: <SafetyTrust />
    },
      {
      path: '/faq',
      element: <FAQ />
    },
    {
      path: '/contact',
      element: <Contact />
    },{
      path: '/legal',
      element: <Legal />
    },
    {
      path: '/admin-dashboard',
      element: (
        <ProtectedRoutes>
          <AdminDashBoard />
        </ProtectedRoutes>
      ),
      errorElement: <NotFound />, 
      children: [
        { path: "manage-hostels", element: <HostelManager /> },
        { path: "manage-rooms", element: <RoomManager /> },
        { path: "product-media", element: <MediaManager /> },
        { path: "manage-amenities", element: <AmenityManager /> },
        { path: "manage-reviews", element: <ReviewManager /> },
        { path: "manage-users", element: <ManageUsers /> },
        { path: "Hostel-verifications", element: <AdminVerificationPanel /> },
      ],
    },
    {
      path: '/owner-dashboard',
      element: (
        <ProtectedRoutes>
          <OwnerDashBoard /> 
        </ProtectedRoutes>
      ),
      errorElement: <NotFound />, 
      children: [
        { path: "my-hostels", element: <MyHostels /> },
        { path: "rooms", element: <OwnerRoomManager /> },
        { path: "media", element: <OwnerMediaManager /> },
        { path: "amenities", element: <OwnerAmenityManager /> },
        { path: "reviews", element: <OwnerReviewManager/> },
         { path: "profile", element: <UserProfileManager/> },
      ],
    },
    {
      path: "*",
      element: <NotFound />
    }
  ]);

  return (
    <>
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#0F172A', 
            color: '#F1F5F9', 
            border: '1px solid rgba(99, 102, 241, 0.2)', 
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            borderRadius: '16px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#6366F1', 
              secondary: '#fff',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
};

export default App;