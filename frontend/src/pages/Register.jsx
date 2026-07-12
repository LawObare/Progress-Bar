/*
  ─── Register Page (Public) ───

  API: POST /auth/register
  Body: { fullName, email, password, confirmPassword }
  Response: { token, user }
*/

import { Link } from "react-router-dom";
import Button from "../components/Button";
import "../styles/auth.css";

function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
    /* API: POST /auth/register */
  };

  return (
    <div className="Auth">
      <div className="Auth-card">
        <h1 className="Auth-title">Create Account</h1>

        <form onSubmit={handleSubmit} className="Auth-form">
          <div className="Auth-field">
            <label>Full Name</label>
            <input type="text" placeholder="Lawrence Obare" required />
          </div>

          <div className="Auth-field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" required />
          </div>

          <div className="Auth-field">
            <label>Password</label>
            <input type="password" placeholder="Create a password" required />
          </div>

          <div className="Auth-field">
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm your password" required />
          </div>

          <div className="Auth-warning">
            ⚠️ Progress Bar is still under active development.
            <br />
            Password recovery isn&apos;t available yet, so please use a password
            you&apos;ll remember.
            <br />
            Thanks for helping test the app! 🚀
          </div>

          <Button type="submit" className="Auth-submit">Create Account</Button>
        </form>

        <div className="Auth-divider" />

        <p className="Auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="Auth-link">Sign In</Link>
        </p>

        <p className="Auth-footer-quote">
          &ldquo;Every project starts with the first commit.&rdquo;
        </p>
      </div>
    </div>
  );
}

export default Register;
