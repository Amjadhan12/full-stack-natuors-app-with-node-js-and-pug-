// Get JWT token from cookies
export const getAuthToken = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'jwt') {
      return value;
    }
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getAuthToken() !== null;
};
