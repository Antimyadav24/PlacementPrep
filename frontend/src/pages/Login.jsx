import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { useAppAuth, isClerkMode } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { ADMIN_EMAIL } from '../constants/auth';
import { ShieldCheck, UserRound } from 'lucide-react';

const clerkAppearance = {
  elements: {
    rootBox: 'mx-auto w-full',
    card: 'bg-gray-900 border border-white/10 shadow-2xl rounded-2xl',
    headerTitle: 'text-white font-bold',
    headerSubtitle: 'text-gray-400',
    socialButtonsBlockButton: 'bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all',
    socialButtonsBlockButtonText: 'text-white font-medium',
    dividerLine: 'bg-white/10',
    dividerText: 'text-gray-500',
    formFieldLabel: 'text-gray-300 font-medium',
    formFieldInput: 'bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-electric-blue/50 focus:border-electric-blue outline-none transition-all',
    formButtonPrimary: 'bg-electric-blue hover:bg-blue-600 transition-all text-white font-bold py-3',
    footerActionLink: 'text-electric-blue hover:text-blue-400 transition-colors font-bold',
    identityPreviewText: 'text-white',
    identityPreviewEditButtonIcon: 'text-electric-blue',
  },
};

const Login = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, login } = useAppAuth();

  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLocalLogin = async (role) => {
    const isAdmin = role === 'admin';
    await login({
      email: isAdmin ? ADMIN_EMAIL : 'student@placeprep.local',
      fullName: isAdmin ? 'Admin User' : 'Student User',
      role,
    });
    navigate(isAdmin ? '/admin' : '/dashboard', { replace: true });
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex flex-col items-center">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to continue to your dashboard.</p>
            </div>
            {isClerkMode ? (
              <SignIn
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                fallbackRedirectUrl="/dashboard"
                appearance={clerkAppearance}
              />
            ) : (
              <div className="w-full rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl">
                <div className="grid gap-3">
                  <button
                    onClick={() => handleLocalLogin('student')}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-left transition-all hover:border-electric-blue/60 hover:bg-electric-blue/10"
                  >
                    <UserRound className="h-5 w-5 text-electric-blue" />
                    <div>
                      <p className="font-bold text-white">Student Login</p>
                      <p className="text-xs text-gray-400">Open personal practice dashboard</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleLocalLogin('admin')}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-left transition-all hover:border-emerald-400/60 hover:bg-emerald-400/10"
                  >
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="font-bold text-white">Admin Login</p>
                      <p className="text-xs text-gray-400">Open private admin content panel</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;
