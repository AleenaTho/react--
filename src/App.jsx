import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import LoginPage from './LoginPage.jsx';
import SignUpPage from './SignUpPage.jsx';
import QuoteGeneratorPage from './QuoteGeneratorPage.jsx';
import ProfilePage from './ProfilePage.jsx';

// Updated Navbar with a Logout button
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful, navigate to login page.
      navigate('/login');
    }).catch((error) => {
      console.error('Sign out error', error);
    });
  };

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    padding: '1rem',
    backgroundColor: 'rgba(100, 174, 199, 0.9)',
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  };
  const linkStyle = { color: 'white', margin: '0 15px', textDecoration: 'none', fontSize: '1.2em', fontWeight: 'bold' };
  const buttonStyle = { ...linkStyle, background: 'none', border: 'none', cursor: 'pointer' };

  return (
    <nav style={navStyle}>
      <Link to="/quote-generator" style={linkStyle}>Quote Generator</Link>
      <Link to="/profile" style={linkStyle}>My Profile</Link>
      <button onClick={handleLogout} style={buttonStyle}>Logout</button>
    </nav>
  );
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const contentStyle = { paddingTop: '80px' };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5em' }}>Loading...</div>;
  }

  return (
    <>
      {currentUser && <Navbar />}
      <div style={currentUser ? contentStyle : {}}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/quote-generator" element={currentUser ? <QuoteGeneratorPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={currentUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/" element={currentUser ? <Navigate to="/quote-generator" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;