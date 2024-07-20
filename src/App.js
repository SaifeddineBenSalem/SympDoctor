import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import Charts from './dashboard/Charts';
import ChartsD from './dashboard/doctors/ChartsD';

import ViewPending from './dashboard/doctors/ViewPending';
import ReviewRequest from './dashboard/doctors/ReviewRequest';
import ReviewRequestReasons from './dashboard/doctors/ReviewRequestReasons';

import Users from './dashboard/admin/Users';
import ApplicationView from './dashboard/ApplicationView';
import FeedbackView from './dashboard/FeedbackView';

import { UserContext } from './dashboard/UserContext';

import AddDisease from './dashboard/AddDisease';
import ApplyToBeADoctor from './dashboard/ApplyToBeADoctor';
import PostAFeedback from './dashboard/PostAFeedback';


import ListApplications from './dashboard/ListApplications';
import ListFeedBack from './dashboard/ListFeedBack';


import AddIllness from './dashboard/AddIllness';
import VisualiseProfileByAdmin from './dashboard/admin/VisualiseProfileByAdmin';


import VisualiseProfile from './dashboard/VisualiseProfile';
import EditProfile from './dashboard/EditProfile';
import ViewDiseasesList from './dashboard/doctors/ViewDiseasesList';

import ViewDiseaseBodySymptoms from './dashboard/doctors/ViewDiseaseBodySymptoms';

import HomePage from './homepage/HomePage';
import Login from './homepage/Login';
import Register from './homepage/Register';
import {jwtDecode} from 'jwt-decode';

// Function to check if user is logged in
const isLoggedIn = () => {
  // Check if token exists in localStorage (or sessionStorage if using session-based login)
  const token = localStorage.getItem('token');
  if (!token) return false;

  return !isTokenExpired(token);
};
const isTokenExpired = (token) => {
  if (!token) return true;

  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  return decodedToken.exp < currentTime;
};

function App() {
  const { user, loading } = useContext(UserContext);
  const token = localStorage.getItem('token');

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching user data
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={isLoggedIn() ? <Navigate to="/dashboard" /> : <HomePage />} />
          <Route path="/login" element={isLoggedIn() ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isLoggedIn() ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard/add" element={isLoggedIn() ? <AddIllness /> : <Navigate to="/" />} />
          <Route path="/dashboard/profile" element={isLoggedIn() ? <VisualiseProfile /> : <Navigate to="/" />} />
          <Route path="/dashboard/profile/:userId" element={isLoggedIn() && user && (user.role === "Admin" || user.role === "SuperAdmin") ? <VisualiseProfileByAdmin /> : <Navigate to="/" />} />
          <Route path="/dashboard/apply/view/:appId" element={isLoggedIn() ? <ApplicationView /> : <Navigate to="/" />} />
          <Route path="/dashboard/feedback/list/:feedbackId" element={isLoggedIn() ? <FeedbackView /> : <Navigate to="/" />} />
          <Route path="/dashboard/charts" element={isLoggedIn() ? <Charts /> : <Navigate to="/" />} />
          <Route path="/dashboard/profile/edit" element={isLoggedIn() ? <EditProfile /> : <Navigate to="/" />} />
          <Route path="/dashboard/apply/view" element={isLoggedIn() ? <ListApplications /> : <Navigate to="/" />} />
          <Route path="/dashboard/feedback/post" element={isLoggedIn() ? <PostAFeedback /> : <Navigate to="/" />} />
          <Route path="/dashboard/feedback/list" element={isLoggedIn() ? <ListFeedBack /> : <Navigate to="/" />} />
          <Route path="/dashboard/apply" element={isLoggedIn() && user && (user.role === "Client") ? <ApplyToBeADoctor /> : <Navigate to="/" />} />
          <Route path="/dashboard/doctors/pending" element={isLoggedIn() && user && (user.role === "Doctor" || user.role === "SuperDoctor") ? <ViewPending /> : <Navigate to="/" />} />
          <Route path="/dashboard/doctors/diseases" element={isLoggedIn() && user && (user.role === "Doctor" || user.role === "SuperDoctor") ? <ViewDiseasesList /> : <Navigate to="/" />} />
          <Route path="/dashboard/doctors/diseases/:diseaseNameParam" element={isLoggedIn() && user && (user.role === "Doctor" || user.role === "SuperDoctor") ? <ViewDiseaseBodySymptoms /> : <Navigate to="/" />} />
          <Route path="/dashboard/doctors/pending/review/:diseaseId" element={isLoggedIn() && user && (user.role === "Doctor" || user.role === "SuperDoctor") ? <ReviewRequest /> : <Navigate to="/" />} />
          <Route path="/dashboard/doctors/pending/review/reasons/:diseaseId" element={isLoggedIn() && user && (user.role === "Doctor" || user.role === "SuperDoctor") ? <ReviewRequestReasons /> : <Navigate to="/" />} />

          <Route path="/dashboard/doctors/add" element={isLoggedIn() && user && (user.role === "Doctor" || user.role === "SuperDoctor") ? <AddDisease /> : <Navigate to="/" />} />
          <Route path="/dashboard/doctors/charts" element={isLoggedIn() && user && (user.role != "Client") ? <ChartsD /> : <Navigate to="/" />} />
          <Route path="/dashboard/admin/users" element={isLoggedIn() && user && (user.role === "Admin" || user.role === "SuperAdmin") ? <Users /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={isLoggedIn() ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
