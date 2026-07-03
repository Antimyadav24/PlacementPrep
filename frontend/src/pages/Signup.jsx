import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';
import { useAppAuth, isClerkMode } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const clerkAppearance = {
  elements: {
    rootBox: 'mx-auto w-full',
    card: 'bg-gray-900 border border-white/10 shadow-2xl rounded-2xl',
    headerTitle: 'text-white',
    headerSubtitle: 'text-gray-400',
    socialButtonsBlockButton: 'bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors',
    socialButtonsBlockButtonText: 'text-white',
    dividerLine: 'bg-white/10',
    dividerText: 'text-gray-500',
    formFieldLabel: 'text-gray-300',
    formFieldInput: 'bg-white/5 border-white/10 text-white focus:ring-electric-blue focus:border-electric-blue',
    formButtonPrimary: 'bg-electric-blue hover:bg-blue-600 transition-all text-white font-bold',
    footerActionLink: 'text-electric-blue hover:text-blue-400 transition-colors',
  },
};

const Signup = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, signup } = useAppAuth();

  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLocalSignup = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await signup({
      fullName: form.get('fullName'),
      email: form.get('email'),
      role: 'student',
    });
    navigate('/dashboard', { replace: true });
  };

  return (
    <PageTransition>
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-electric-blue/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md flex flex-col items-center"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Join the elite community of job seekers.</p>
          </div>

          {isClerkMode ? (
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              fallbackRedirectUrl="/dashboard"
              appearance={clerkAppearance}
            />
          ) : (
            <form onSubmit={handleLocalSignup} className="w-full rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-electric-blue/10 text-electric-blue">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Full name</label>
                <input name="fullName" defaultValue="Student User" required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-electric-blue" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Email</label>
                <input name="email" type="email" defaultValue="student@placeprep.local" required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-electric-blue" />
              </div>
              <button type="submit" className="w-full rounded-xl bg-electric-blue px-4 py-3 text-sm font-bold text-white transition-all hover:bg-blue-600">
                Create Student Account
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Signup;
