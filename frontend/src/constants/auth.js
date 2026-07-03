export const ADMIN_EMAIL = 'antimayadav917062@gmail.com';

export const getUserEmail = (user) =>
  user?.primaryEmailAddress?.emailAddress ||
  user?.emailAddresses?.[0]?.emailAddress ||
  '';

export const isAdminUser = (user) => user?.role === 'admin' || getUserEmail(user) === ADMIN_EMAIL;
