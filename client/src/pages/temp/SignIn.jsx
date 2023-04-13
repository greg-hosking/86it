import React, { useState } from 'react';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      alert(response.status);
    } else {
      alert(await response.text());
    }
  }

  return (
    <>
      <form
        onSubmit={(event) => {
          handleFormSubmit(event);
        }}
      >
        <img
          src='https://86it-images.s3.amazonaws.com/user.svg'
          style={{ width: '100%', height: '100%' }}
          draggable='false'
        />
        <h1>Sign In</h1>
        <div>
          <label htmlFor='email-input'>Email</label>
          <input
            type='email'
            name='email-input'
            id='email-input'
            required
            value={email}
            onChange={(event) => {
              handleEmailChange(event);
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
            onChange={(event) => {
              handlePasswordChange(event);
            }}
          />
        </div>
        <input type='submit' />
        <p>
          Don't have an account? <a href='/temp/sign-up'>Sign up.</a>
        </p>
        <a href='/temp/forgot-password'>Forgot password?</a>
      </form>
    </>
  );
}

export default SignIn;
