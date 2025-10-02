import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';

// --- STYLES OBJECT ---
const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  loginCard: {
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 123, 255, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5em',
    color: '#343a40',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '15px',
    fontSize: '1em',
    border: '1px solid #ced4da',
    borderRadius: '8px',
    width: '100%',
    boxSizing: 'border-box', // Important for padding to not affect width
  },
  button: {
    padding: '15px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  linksContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontSize: '0.9em',
  },
  errorText: {
    color: '#dc3545',
    marginTop: '15px',
  }
};


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/quote-generator');
    } catch (err) {
      setError('Failed to log in. Please check your email and password.');
      console.error("Login error:", err);
    }
  };

  const handleForgotPassword = async () => {
    const emailForReset = prompt("Please enter your email to receive a password reset link:");
    if (!emailForReset) return;
    try {
      await sendPasswordResetEmail(auth, emailForReset);
      alert("Password reset email sent! Please check your inbox.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Could not send reset email. Make sure the email is correct.");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginCard}>
        <h1 style={styles.title}>Welcome Back</h1>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        {error && <p style={styles.errorText}>{error}</p>}

        <div style={styles.linksContainer}>
          <button 
            type="button"
            onClick={handleForgotPassword}
            style={styles.link}
          >
            Forgot Password?
          </button>
          <Link to="/signup" style={styles.link}>
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;