/*
  ─── Login Page (Public) ───

  API: POST /auth/login
  Body: { email, password, rememberMe }
  Response: { token, user }
*/

import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import "../styles/auth.css";

function Login() {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    /* API: POST /auth/login */
  };

  return (
    <div className="Auth">
      <div className="Auth-card">
        <div className="Auth-brand">
          <h1 className="Auth-logo">Progress Bar</h1>
          <p className="Auth-tagline">Build. Learn. Grow.</p>
        </div>

        <form onSubmit={handleSubmit} className="Auth-form">
          <div className="Auth-field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" required />
          </div>

          <div className="Auth-field">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <label className="Auth-remember">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>

          <Button type="submit" className="Auth-submit">Sign In</Button>
        </form>

        <div className="Auth-divider" />

        <p className="Auth-switch">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="Auth-link">Create Account</Link>
        </p>

        <p className="Auth-footer-quote">
          &ldquo;Small commits become great software.&rdquo;
        </p>
      </div>
    </div>
  );
}

export default Login;
