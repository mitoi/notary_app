import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';

function LoginPage() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <LoginForm />
              <p className="mt-3">
                Don't have an account? <Link to="/register">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
