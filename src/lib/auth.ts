import toast from "react-hot-toast";

const TOKEN_KEY = 'scaly_token';

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    // Set cookie to expire in 24 hours, accessible across the site
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;
    // after login success
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${TOKEN_KEY}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
  }
  return null;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    // Clear the cookie by setting its expiration date to the past
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    toast.success('Logged out successfully!');
    window.location.href = '/login';
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
