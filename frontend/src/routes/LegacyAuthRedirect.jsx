import { Navigate, useLocation } from 'react-router-dom';

/**
 * Redirects legacy /login/* and /signup/* paths to /sign-in/* and /sign-up/*
 * so OAuth SSO callbacks (e.g. /signup/sso-callback) complete correctly.
 */
const LegacyAuthRedirect = ({ to }) => {
  const location = useLocation();
  const legacyPrefix = location.pathname.startsWith('/signup') ? '/signup' : '/login';
  const remainder = location.pathname.slice(legacyPrefix.length);
  const search = location.search || '';
  return <Navigate to={`${to}${remainder}${search}`} replace />;
};

export default LegacyAuthRedirect;
