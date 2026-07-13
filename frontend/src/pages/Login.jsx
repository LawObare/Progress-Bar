/*
  ─── Login Page (Public) ───

  API: POST /auth/login
  Body: { email, password, rememberMe }
  Response: { token, user }
*/

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import "../styles/auth.css";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    /* API: POST /auth/login */
    const user = { name: fd.get("email").split("@")[0] };
    login(user);
    navigate("/home");
  };

  return (
    <div className="Auth">
      <div className="Auth-card">
        <div className="Auth-brand">
          <h1 className="Auth-logo">Progress Bar</h1>
          <p className="Auth-tagline">Your developer operating system.</p>
        </div>

        <form onSubmit={handleSubmit} className="Auth-form">
          <div className="Auth-field">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" required />
          </div>

          <div className="Auth-field">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" required />
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
