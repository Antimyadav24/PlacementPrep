import axios from 'axios';
import { useMemo } from 'react';
import { API_BASE_URL } from '../api/config';
import { useAppAuth } from '../context/AuthContext';

const useApi = () => {
  const { getToken, user } = useAppAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
    });

    instance.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        if (user) {
          const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
          const fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();
          if (email) {
            config.headers['X-User-Email'] = email;
          }
          if (fullName) {
            config.headers['X-User-Name'] = fullName;
          }
        }
      } catch (err) {
        console.warn("Could not get auth token", err);
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    return instance;
  }, [getToken, user]);

  return api;
};

export default useApi;
