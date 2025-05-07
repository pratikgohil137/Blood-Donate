import { useState } from 'react';
import Header from './Component/Header';
import HeroSection from './Component/HeroSection';
import ServiceCards from './Component/ServiceCards';
import Eligible from './Component/Eligible';
import FAQ from './Component/FAQ';
import ShowHospital2 from './Component/ShowHospital2';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Component/Login';
import Register from './Component/Register';
import Forgotpass from './Component/ForgotPassword';
import BloodCompatibility from './Component/BloodCompatibility';
import Eligibleform from './Component/Eligibleform';
import Mission from './Component/Mission';
import AboutUs from './Component/AboutUs';
import Footer from './Component/Footer';
import Feedback from './Component/Feedback';
import Dashboard from './Component/Dashboard';
import ForgotPassword from './Component/ForgotPassword';
import ResetPassword from './Component/ResetPassword';
import OrganizationLogin from './Component/OrganizationLogin';
import OrganizationRegister from './Component/OrganizationRegister';
import AdminDashboard from './Component/AdminDashboard';
import AdminSetup from './Component/AdminSetup';
import HospitalDashboard from './Component/HospitalDashboard';
import AwarenessSection from './Component/AwarenessSection';
import BloodTypes from './Component/BloodTypes';
import UserProfile from './Component/UserProfile';j
import AccountSettings from './Component/AccountSettings';
import { AuthProvider } from './contexts/AuthContext';
import AdminVerifyHospitals from './Component/AdminVerifyHospitals';
import ProtectedRoute from './Component/ProtectedRoute';
import HospitalVerification from './Component/HospitalVerification';
import FindDonor from './Component/FindDonor';
import DonorRegistration from './Component/DonorRegistration';
import BloodCamps from './Component/BloodCamps';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <Header />
        <HeroSection />
        <ServiceCards />
        <Mission />
        {/* <Eligibleform /> */}
        <ShowHospital2 />
        <BloodCompatibility />
        <FAQ />
        <AboutUs />
        <Feedback />
        <Footer />
      </div>
    ),
  },
  {
    path: '/eligible',
    element: (
      <div>
        <Header />
        <Eligible />
        <Footer />
      </div>
    ),
  },
  {
    path: '/register',
    element: (
      <div>
        <Header />
        <Register />
        <Footer />
      </div>
    ),
  },
  {
    path: '/login',
    element: (
      <div>
        <Header />
        <Login />
        <Footer />
      </div>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <div>
        <ForgotPassword />
        <Footer />
      </div>
    ),
  },
  {
    path: '/reset-password/:token',
    element: (
      <div>
        <ResetPassword />
        <Footer />
      </div>
    ),
  },
  {
    path: '/mission',
    element: (
      <div>
        <Header />
        <Mission />
        <Footer />
      </div>
    ),
  },
  {
    path: '/aboutus',
    element: (
      <div>
        <Header />
        <AboutUs />
        <Footer />
      </div>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <div>
        <Dashboard />
        <Footer />
      </div>
    ),
  },
  {
    path: '/organization-login',
    element: (
      <div>
        <Header />
        <OrganizationLogin />
        <Footer />
      </div>
    ),
  },
  {
    path: '/organization-register',
    element: (
      <div>
        <Header />
        <OrganizationRegister />
        <Footer />
      </div>
    ),
  },
  {
    path: '/admin-dashboard',
    element: (
      <ProtectedRoute>
        <AdminDashboard />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/verify-hospitals',
    element: (
      <ProtectedRoute>
        <AdminVerifyHospitals />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: '/hospital-dashboard',
    element: (
      <div>
        <HospitalDashboard />
        <Footer />
      </div>
    ),
  },
  {
    path: '/show-hospital',
    element:(
      <div>
        <Header />
        <ShowHospital2 />
        <Footer />
      </div>
    )
  },
  {
    path: '/awareness',
    element:(
      <div>
        <Header />
        <AwarenessSection />
        <Footer />
      </div>
    )
  },
  {
    path: '/blood-types',
    element: (
      <div>
        <Header />
        <BloodTypes />
        <Footer />
      </div>
    ),
  },
  {
    path: '/blood-compatibility',
    element: (
      <div>
        <Header />
        <BloodCompatibility />
        <Footer />
      </div>
    ),
  },
  {
    path: '/find-donor',
    element: (
      <div>
        <Header />
        <FindDonor />
        <Footer />
      </div>
    ),
  },
  {
    path: '/donor-registration',
    element: (
      <div>
        <Header />
        <DonorRegistration />
        <Footer />
      </div>
    ),
  },
  {
    path: '/profile',
    element: (
      <div>
        <Header />
        <UserProfile />
        <Footer />
      </div>
    ),
  },
  {
    path: '/settings',
    element: (
      <div>
        <Header />
        <AccountSettings />
        <Footer />
      </div>
    ),
  },
  {
    path: '/admin-setup',
    element: (
      <div>
        <Header />
        <AdminSetup />
        <Footer />
      </div>
    ),
  },
  {
    path: '/hospital-verification',
    element: (
      <div>
        <Header />
        <HospitalVerification />
        <Footer />
      </div>
    ),
  },
  {
    path: '/blood-camps',
    element: (
      <div>
        <Header />
        <BloodCamps />
        <Footer />
      </div>
    ),
  },
  {
    path: '/FAQ',
    element: (
      <div>
        <Header />
        <FAQ />
        <Footer />
      </div>
    ),
  },
  {
    path: '*',
    element: (
      <div>
        <Header />
        <div style={{ 
          height: '50vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '2rem'
        }}>
          <h2>404 - Page Not Found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <Footer />
      </div>
    ),
  },
]);

function AppMain() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default AppMain; 