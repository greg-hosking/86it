import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../../contexts/AuthContext.jsx';
import Error from '../../components/Error.jsx';

function ResetPassword() {
  const { authenticatedUser, signIn } = useContext(AuthContext.AuthContext);
  const navigate = useNavigate();

  const token = new URLSearchParams(window.location.search).get('token');

  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to /me/restaurants if user is already signed in
  useEffect(() => {
    if (authenticatedUser) {
      navigate('/me/restaurants');
    }
  }, [authenticatedUser]);

  return (
    <div className='content-container content-container-sm'>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          if (password1 !== password2) {
            setPassword1('');
            setPassword2('');
            setError('Passwords do not match');
            setLoading(false);
            return;
          }
          const response = await fetch('/api/users/password-reset', {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              password: password1,
            }),
          });
          switch (response.status) {
            case 200:
              navigate('/me/restaurants');
              break;
            case 401:
            case 403:
              setError('Invalid token');
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
        <h1>Reset Password</h1>
        {error && (
          <Error
            error={error}
            dismiss={() => {
              setError('');
            }}
          />
        )}
        <div>
          <label htmlFor='password1-input'>Password</label>
          <input
            type='password'
            name='password1-input'
            id='password1-input'
            required={true}
            value={password1}
            onChange={(e) => {
              setPassword1(e.target.value);
              setPassword2('');
              setError('');
            }}
          />
        </div>
        <div>
          <label htmlFor='password2-input'>Confirm Password</label>
          <input
            type='password'
            name='password2-input'
            id='password2-input'
            required={true}
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value);
              setError('');
            }}
          />
        </div>
        <input
          type='submit'
          value={loading ? 'Loading' : 'Submit'}
          disabled={loading}
        />
        <p>
          Don't have an account? <a href='/sign-up'>Sign up.</a>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;
