import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../../contexts/AuthContext.jsx';
import Error from '../../components/Error.jsx';

function SignIn() {
  const { authenticatedUser, signIn } = useContext(AuthContext.AuthContext);
  const navigate = useNavigate();

  const token = new URLSearchParams(window.location.search).get('token');
  const [verified, setVerified] = useState(false);
  const shouldVerify = useRef(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to /me/restaurants if user is already signed in
  useEffect(() => {
    if (authenticatedUser) {
      navigate('/me/restaurants');
    }

    async function verify() {
      setLoading(true);
      const response = await fetch('/api/users/me/email-verification', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      switch (response.status) {
        case 200:
          setVerified(true);
          break;
        case 401:
        case 403:
          setError('Invalid token');
          break;
        default:
          setError('An unknown error occurred');
      }
      setLoading(false);
    }
    if (token && shouldVerify.current) {
      verify();
      shouldVerify.current = false;
    }
  }, [authenticatedUser]);

  return (
    <div className='content-container content-container-sm'>
      {token && !verified ? (
        <>{loading ? <p>Verifying...</p> : <Error error={error} />}</>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            const status = await signIn(email, password);
            switch (status) {
              case 200:
                navigate('/me/restaurants');
                break;
              case 401:
                setError('Incorrect email or password');
                break;
              case 403:
                setError('Account not verified');
                break;
              case 404:
                setError('Account not found');
                break;
              default:
                setError('An unknown error occurred');
            }
            setLoading(false);
          }}
        >
          <h1>Sign In</h1>
          {error && (
            <Error
              error={error}
              dismiss={() => {
                setError('');
              }}
            />
          )}
          <div>
            <label htmlFor='email-input'>Email</label>
            <input
              type='email'
              name='email-input'
              id='email-input'
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
          </div>
          <div>
            <label htmlFor='password-input'>Password</label>
            <input
              type='password'
              name='password-input'
              id='password-input'
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
            <a href='/forgot-password' id='forgot-password-link'>
              Forgot password?
            </a>
          </div>
          <input
            type='submit'
            value={loading ? 'Loading' : 'Sign In'}
            disabled={loading}
          />
          <p>
            Don't have an account? <a href='/sign-up'>Sign up.</a>
          </p>
        </form>
      )}
    </div>
  );
}

export default SignIn;
