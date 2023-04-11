import React, { useState } from 'react';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  function handleFirstNameChange(event) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event) {
    setLastName(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePassword1Change(event) {
    setPassword1(event.target.value);
    setPassword2('');
  }

  function handlePassword2Change(event) {
    setPassword2(event.target.value);
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    if (!(firstName && lastName && email && password1 && password2)) {
      alert('');
      return;
    }

    if (password1 !== password2) {
      alert('Passwords do not match.');
      setPassword1('');
      setPassword2('');
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

    const data = await response.json();
    alert(`User ID: ${data.id}`);

    setEmailSent(true);
  }

  return (
    <>
      <form
        onSubmit={(event) => {
          handleFormSubmit(event);
        }}
      >
        <h1>Sign Up</h1>
        <div>
          <label htmlFor='first-name-input'>First Name</label>
          <input
            type='text'
            name='first-name-input'
            id='first-name-input'
            required
            disabled={emailSent}
            value={firstName}
            onChange={(event) => {
              handleFirstNameChange(event);
            }}
          />
        </div>
        <div>
          <label htmlFor='last-name-input'>Last Name</label>
          <input
            type='text'
            name='last-name-input'
            id='last-name-input'
            required
            disabled={emailSent}
            value={lastName}
            onChange={(event) => {
              handleLastNameChange(event);
            }}
          />
        </div>
        <div>
          <label htmlFor='email-input'>Email</label>
          <input
            type='email'
            name='email-input'
            id='email-input'
            required
            disabled={emailSent}
            value={email}
            onChange={(event) => {
              handleEmailChange(event);
            }}
          />
        </div>
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
        <input type='submit' disabled={emailSent} />
        <p>
          Already have an account? <a href='/temp/signin'>Sign in.</a>
        </p>
        <br />
        {emailSent && (
          <>
            <p>Account successfully created!</p>
            <p>
              Verification email sent to <b>{email}</b>
            </p>
          </>
        )}
      </form>
    </>
  );
}

export default SignUp;
