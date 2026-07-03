import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import LegacyAuthRedirect from './LegacyAuthRedirect';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Aptitude from '../pages/Aptitude';
import Technical from '../pages/Technical';
import TestRunner from '../pages/TestRunner';
import MockTest from '../pages/MockTest';
import Leaderboard from '../pages/Leaderboard';
import AdminDashboard from '../pages/AdminDashboard';
import InterviewPrep from '../pages/InterviewPrep';
import Practice from '../pages/Practice';
import CodingPractice from '../pages/CodingPractice';
import Resources from '../pages/Resources';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />

      {/* Clerk auth — wildcard required for SSO callbacks (e.g. /sign-up/sso-callback) */}
      <Route path="/sign-in/*" element={<Login />} />
      <Route path="/sign-up/*" element={<Signup />} />

      {/* Legacy paths → redirect preserving subpath (fixes /signup/sso-callback 404) */}
      <Route path="/login/*" element={<LegacyAuthRedirect to="/sign-in" />} />
      <Route path="/signup/*" element={<LegacyAuthRedirect to="/sign-up" />} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
      <Route path="/coding-practice" element={<ProtectedRoute><CodingPractice /></ProtectedRoute>} />
      <Route path="/aptitude" element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
      <Route path="/technical" element={<ProtectedRoute><Technical /></ProtectedRoute>} />
      <Route path="/test/:moduleType/:category" element={<ProtectedRoute><TestRunner /></ProtectedRoute>} />
      <Route path="/mock-test" element={<ProtectedRoute><MockTest /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

      {/* 404 — must be last; Clerk callback paths are handled above */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
