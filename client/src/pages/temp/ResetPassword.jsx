import React, { useState } from 'react';

function ResetPassword() {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  function handlePassword1Change(event) {
    setPassword1(event.target.value);
    setPassword2('');
  }

  function handlePassword2Change(event) {
    setPassword2(event.target.value);
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    const response = await fetch('/api/auth/recovery', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });
  }

  return (
    <>
      <form
        onSubmit={(event) => {
          handleFormSubmit(event);
        }}
      >
        <h1>Reset Password</h1>
        <div>
          <label htmlFor='password1-input'>Password</label>
          <input
            type='password'
            name='password1-input'
            id='password1-input'
            required
            disabled={emailSent}
            value={password1}
            onChange={(event) => {
              handlePassword1Change(event);
            }}
          />
        </div>
        <div>
          <label htmlFor='password2-input'>Confirm Password</label>
          <input
            type='password'
            name='password2-input'
            id='password2-input'
            required
            disabled={emailSent}
            value={password2}
            onChange={(event) => {
              handlePassword2Change(event);
            }}
          />
        </div>
        <input type='submit' />
        <p>
          Don't have an account? <a href='/temp/sign-up'>Sign up.</a>
        </p>
      </form>
    </>
  );
}

export default ResetPassword;
