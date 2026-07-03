import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { useAppAuth, isClerkMode } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import {
  BookOpen, Menu, X, LogOut, LayoutDashboard, Trophy, BrainCircuit, Code,
  Target, ShieldCheck, GraduationCap, FolderOpen, BarChart3, Users, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import ConfirmModal from './ConfirmModal';

const STUDENT_LINKS = [
  { name: 'Placement Hub', path: '/practice', icon: BookOpen },
  { name: 'Coding', path: '/coding-practice', icon: Code },
  { name: 'Assessments', path: '/mock-test', icon: Target },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
];

const ADMIN_LINKS = [
  { name: 'Overview', path: '/dashboard', icon: BarChart3 },
  { name: 'Content', path: '/admin', icon: Database },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { isSignedIn, signOut, isLoaded, isAdmin, user } = useAppAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navLinks = isAdmin && isSignedIn ? ADMIN_LINKS : STUDENT_LINKS;

  const handleLogout = async () => {
    await signOut();
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  if (!isLoaded) return <nav className="h-16 border-b border-border bg-black" />;

  return (
    <nav className="sticky top-0 z-[80] w-full border-b border-border bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LEFT: Logo */}
          <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-black font-black">
              P
            </div>
            <span className="font-bold text-lg text-primary tracking-tight">
              PlacePrep
              {isAdmin && <span className="text-[10px] ml-2 px-1.5 py-0.5 bg-accent/20 text-accent rounded uppercase">Admin</span>}
            </span>
          </Link>

          {/* CENTER: Text Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}
                className="text-sm font-medium text-muted hover:text-primary transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT: Actions */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <ThemeToggle />
            {isSignedIn ? (
              <div className="flex items-center gap-4 border-l border-border pl-4">
                <Link to="/dashboard" className="text-sm font-medium text-muted hover:text-primary transition-colors">
                  {isAdmin ? 'Analytics' : 'Dashboard'}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
                    Panel
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  {isClerkMode ? (
                    <UserButton afterSignOutUrl="/" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface border border-border text-xs font-bold text-primary">
                      {(user?.firstName || 'U').slice(0, 1)}
                    </div>
                  )}
                  <button onClick={() => setIsLogoutModalOpen(true)} className="text-muted hover:text-danger transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-border pl-4">
                <Link to="/sign-in" className="text-sm font-medium text-muted hover:text-primary transition-colors">Login</Link>
                <Button variant="primary" className="py-1.5 px-4 text-sm font-semibold rounded-md" onClick={() => navigate('/sign-up')}>Get Started</Button>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            {isSignedIn && isClerkMode && <UserButton afterSignOutUrl="/" />}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-muted hover:text-primary transition-colors">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#000000] border-b border-border overflow-hidden">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-muted hover:text-primary hover:bg-surface rounded-md transition-colors">
                  {link.name}
                </Link>
              ))}
              {isSignedIn && (
                <div className="pt-2 mt-2 border-t border-border">
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm font-medium text-muted hover:text-primary hover:bg-surface rounded-md transition-colors">
                    {isAdmin ? 'Analytics' : 'Dashboard'}
                  </Link>
                  <button onClick={() => { setIsMobileMenuOpen(false); setIsLogoutModalOpen(true); }}
                    className="w-full text-left block px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10 rounded-md transition-colors">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onConfirm={handleLogout}
        title="Confirm Sign Out" message="Are you sure you want to sign out?" confirmText="Yes, Sign Out" isDanger />
    </nav>
  );
};

export default Navbar;
