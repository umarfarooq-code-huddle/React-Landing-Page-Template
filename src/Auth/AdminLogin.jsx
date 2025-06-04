import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import styles from './styles/login.module.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to the admin links page
      window.location.href = "/admin-links";
    } catch (err) {
      setError('Invalid email or password');
      setMessage('');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset password.");
      setMessage('');
      return;
    }
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox.");
      setError('');
    } catch (err) {
      setError("Failed to send password reset email. Please check the email address or try again later.");
      setMessage('');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.formTitle}>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.inputField}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.inputField}
        />
        <button type="submit" className={styles.submitButton}>Login</button>
      </form>
      <button onClick={handleForgotPassword} className={styles.forgotPasswordButton}>
        Forgot Password?
      </button>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {message && <p className={styles.infoMessage}>{message}</p>}
    </div>
  );
};

export default AdminLogin;
