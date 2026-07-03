const rawApiUrl = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = rawApiUrl
  ? (rawApiUrl.startsWith('http') ? rawApiUrl : `https://${rawApiUrl}`)
  : '/api';
