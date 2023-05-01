import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext.jsx';

import Error from '../components/Error.jsx';

function AccountSettings() {
  const { authenticatedUser } = useContext(AuthContext.AuthContext);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const [accountFormLoading, setAccountFormLoading] = useState(false);
  const [accountFormError, setAccountFormError] = useState('');
  const [imageFormLoading, setImageFormLoading] = useState(false);
  const [imageFormError, setImageFormError] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setAccountFormLoading(true);
    if (password1 !== password2) {
      setPassword1('');
      setPassword2('');
      setAccountFormError('New passwords do not match');
      setAccountFormLoading(false);
      return;
    }
    const response = await fetch(`/api/users/me`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        password: password1,
      }),
    });
    switch (response.status) {
      case 204:
        setPassword1('');
        setPassword2('');
        setAccountFormError('');
        break;
      default:
        setAccountFormError('An unknown error occurred');
    }
    setAccountFormLoading(false);
    alert('Account saved successfully');
  }

  async function handleUpload(e) {
    e.preventDefault();
    setImageFormLoading(true);
    const formData = new FormData();
    formData.append('image', e.target.image.files[0]);
    const response = await fetch(`/api/users/me/image`, {
      method: 'PUT',
      body: formData,
    });
    switch (response.status) {
      case 204:
        setImageFormError('');
        break;
      default:
        setImageFormError('An unknown error occurred');
    }
    setImageFormLoading(false);
    alert('Image uploaded successfully');
  }

  useEffect(() => {
    if (!authenticatedUser) {
      navigate('/sign-in');
      return;
    }
    setFirstName(authenticatedUser.firstName);
    setLastName(authenticatedUser.lastName);
  }, [authenticatedUser]);

  return (
    <>
      <div className='content-container content-container-md'>
        <h2>Account Settings</h2>
        {accountFormError && (
          <Error
            error={accountFormError}
            dismiss={() => {
              setError('');
            }}
          />
        )}
        {authenticatedUser && (
          <form
            onSubmit={(e) => {
              handleSave(e);
            }}
          >
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
                  setAccountFormError('');
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
                  setAccountFormError('');
                }}
              />
            </div>

            <div>
              <label htmlFor='password1-input'>New Password</label>
              <input
                type='password'
                name='password1-input'
                id='password1-input'
                required={password1 !== '' || password2 !== ''}
                value={password1}
                onChange={(e) => {
                  setPassword1(e.target.value);
                  setAccountFormError('');
                }}
              />
            </div>
            <div>
              <label htmlFor='password2-input'>Confirm New Password</label>
              <input
                type='password'
                name='password2-input'
                id='password2-input'
                required={password1 !== '' || password2 !== ''}
                value={password2}
                onChange={(e) => {
                  setPassword2(e.target.value);
                  setAccountFormError('');
                }}
              />
            </div>
            <input
              type='submit'
              value={accountFormLoading ? 'Loading' : 'Save'}
              disabled={
                accountFormLoading ||
                (firstName === authenticatedUser.firstName &&
                  lastName === authenticatedUser.lastName &&
                  password1 === '' &&
                  password2 === '')
              }
            />
          </form>
        )}
      </div>
      <div className='content-container content-container-md'>
        <h2>Image Upload</h2>
        {imageFormError && (
          <Error
            error={imageFormError}
            dismiss={() => {
              setImageFormError('');
            }}
          />
        )}
        <img
          src={authenticatedUser && authenticatedUser.image}
          alt=''
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        />
        <form
          onSubmit={(e) => {
            handleUpload(e);
          }}
        >
          <div>
            <label htmlFor='image-input'>Image</label>
            <input type='file' id='image' name='image' />
          </div>
          <input
            type='submit'
            value={imageFormLoading ? 'Loading' : 'Upload'}
            disabled={imageFormLoading}
          />
        </form>
      </div>
      <div className='content-container content-container-md'>
        <h2>Account Deletion</h2>
        <input
          type='submit'
          value='Delete Account'
          style={{
            backgroundColor: 'var(--negative)',
          }}
          onClick={() => {
            alert('Not implemented');
          }}
        />
      </div>
    </>
  );
}

export default AccountSettings;
