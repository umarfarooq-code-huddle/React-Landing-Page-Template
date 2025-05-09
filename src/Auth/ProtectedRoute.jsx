import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Check if user is authenticated and email matches
  if (user && user.email === "grantyourrequestfoundation@gmail.com") {
    return children;
  }

  // Redirect to the landing page if not authenticated or email doesn't match
  return <Navigate to="/" />;
};

export default ProtectedRoute;
