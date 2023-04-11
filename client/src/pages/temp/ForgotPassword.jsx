import React, { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  function handleEmailChange(event) {
    setEmail(event.target.value);
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

    alert(await response.text());
  }

  return (
    <>
      <form
        onSubmit={(event) => {
          handleFormSubmit(event);
        }}
      >
        <h1>Forgot Password</h1>
        <p>Enter your email to get a link to reset your password.</p>
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
        <input type='submit' />
        <p>
          Don't have an account? <a href='/temp/sign-up'>Sign up.</a>
        </p>
      </form>
    </>
  );
}

export default ForgotPassword;
