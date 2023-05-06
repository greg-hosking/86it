import { createContext, useEffect, useRef, useState } from 'react';

const AuthContext = createContext({
  authenticatedUser: null,
  setAuthenticatedUser: () => {},
  signIn: async () => {},
  signOut: async () => {},
});

const AuthProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const shouldFetch = useRef(true);

  useEffect(() => {
    async function fetchAuthenticatedUser() {
      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        setAuthenticatedUser(null);
        return;
      }
      const user = await response.json();
      setAuthenticatedUser(user);
    }
    if (shouldFetch.current) {
      fetchAuthenticatedUser();
      shouldFetch.current = false;
    }
  }, []);

  async function signIn(email, password) {
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (response.ok) {
      const user = await response.json();
      setAuthenticatedUser(user);
    }
    return response.status;
  }

  async function signOut() {
    const response = await fetch('/api/sessions', {
      method: 'DELETE',
    });
    if (response.ok) {
      setAuthenticatedUser(null);
    }
    return response.status;
  }

  return (
    <AuthContext.Provider
      value={{
        authenticatedUser,
        setAuthenticatedUser,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default { AuthContext, AuthProvider };
