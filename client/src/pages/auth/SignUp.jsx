import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../../contexts/AuthContext.jsx';
import Error from '../../components/Error.jsx';

function SignUp() {
  const { authenticatedUser } = useContext(AuthContext.AuthContext);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect to /me/restaurants if user is already signed in
  useEffect(() => {
    if (authenticatedUser) {
      navigate('/me/restaurants');
    }
  }, [authenticatedUser]);

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    if (password1 !== password2) {
      setPassword1('');
      setPassword2('');
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password1,
      }),
    });
    switch (response.status) {
      case 201:
        setSuccess(true);
        break;
      case 409:
        setError('An account with that email already exists');
        break;
      default:
        setError('An unknown error occurred');
    }
    setLoading(false);
  }

  return (
    <div className='content-container content-container-sm'>
      <form
        onSubmit={(e) => {
          handleSignUp(e);
        }}
      >
        {success ? (
          <>
            <p>Account successfully created!</p>
            <p>
              Verification email sent to{' '}
              <b style={{ color: 'var(--text-accent)' }}>{email}</b>
            </p>
          </>
        ) : (
          <>
            <h1>Sign Up</h1>
            {error && (
              <Error
                error={error}
                dismiss={() => {
                  setError('');
                }}
              />
            )}
            <div>
              <label htmlFor='first-name-input'>First Name</label>
              <input
                type='text'
                name='first-name-input'
                id='first-name-input'
                required={true}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError('');
                }}
              />
            </div>
            <div>
              <label htmlFor='last-name-input'>Last Name</label>
              <input
                type='text'
                name='last-name-input'
                id='last-name-input'
                required={true}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError('');
                }}
              />
            </div>
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
              value={loading ? 'Loading' : 'Sign Up'}
              disabled={loading}
            />
            <p>
              Already have an account? <a href='/sign-in'>Sign in.</a>
            </p>
          </>
        )}
      </form>
    </div>
  );
}

export default SignUp;
