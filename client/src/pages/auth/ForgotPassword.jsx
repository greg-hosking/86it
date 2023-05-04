import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../../contexts/AuthContext.jsx';
import Error from '../../components/Error.jsx';

function ForgotPassword() {
  const { authenticatedUser } = useContext(AuthContext.AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
          const response = await fetch(
            `/api/users/me/password-reset?email=${email}`,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            }
          );
          switch (response.status) {
            case 200:
              setSuccess(true);
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
        {success ? (
          <>
            <p>
              Password reset email sent to{' '}
              <b style={{ color: 'var(--text-accent)' }}>{email}</b>
            </p>
          </>
        ) : (
          <>
            <h1>Forgot Password</h1>
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
                required={true}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
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
          </>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;
