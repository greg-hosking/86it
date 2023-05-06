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
  const [password3, setPassword3] = useState('');
  const [image, setImage] = useState(null);

  const [accountFormLoading, setAccountFormLoading] = useState(false);
  const [accountFormError, setAccountFormError] = useState('');
  const [passwordFormLoading, setPasswordFormLoading] = useState(false);
  const [passwordFormError, setPasswordFormError] = useState('');
  const [imageFormLoading, setImageFormLoading] = useState(false);
  const [imageFormError, setImageFormError] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setAccountFormLoading(true);
    const response = await fetch(`/api/users/me`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    switch (response.status) {
      case 204:
        setAccountFormError('');
        break;
      default:
        setAccountFormError('An unknown error occurred');
    }
    setAccountFormLoading(false);
    alert('Account saved successfully');
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPasswordFormLoading(true);
    if (password2 !== password3) {
      setPassword2('');
      setPassword3('');
      setPasswordFormError('New passwords do not match');
      setPasswordFormLoading(false);
      return;
    }
    const response = await fetch(`/api/users/me`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldPassword: password1,
        newPassword: password2,
      }),
    });
    switch (response.status) {
      case 204:
        setPassword1('');
        setPassword2('');
        setPassword3('');
        setAccountFormError('');
        break;
      case 401:
        setPassword1('');
        setPassword2('');
        setPassword3('');
        setPasswordFormError('Incorrect password');
        return;
      default:
        setAccountFormError('An unknown error occurred');
        return;
    }
    setAccountFormLoading(false);
    alert('Password reset successfully');
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  }

  async function handleUpload(e) {
    e.preventDefault();
    setImageFormLoading(true);
    const formData = new FormData();
    formData.append('image', e.target.image.files[0]);
    const response = await fetch(`/api/users/me/avatar`, {
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
              setAccountFormError('');
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
            <input
              type='submit'
              value={accountFormLoading ? 'Loading' : 'Save'}
              disabled={
                accountFormLoading ||
                (firstName === authenticatedUser.firstName &&
                  lastName === authenticatedUser.lastName)
              }
            />
          </form>
        )}
      </div>
      <div className='content-container content-container-md'>
        <h2>Password Reset</h2>
        {passwordFormError && (
          <Error
            error={passwordFormError}
            dismiss={() => {
              setPasswordFormError('');
            }}
          />
        )}
        {authenticatedUser && (
          <form
            onSubmit={(e) => {
              handlePasswordChange(e);
            }}
          >
            <div>
              <label htmlFor='password1-input'>Old Password</label>
              <input
                type='password'
                name='password1-input'
                id='password1-input'
                required={true}
                value={password1}
                onChange={(e) => {
                  setPassword1(e.target.value);
                  setPasswordFormError('');
                }}
              />
            </div>
            <div>
              <label htmlFor='password2-input'>New Password</label>
              <input
                type='password'
                name='password2-input'
                id='password2-input'
                required={true}
                value={password2}
                onChange={(e) => {
                  setPassword2(e.target.value);
                  setPasswordFormError('');
                }}
              />
            </div>
            <div>
              <label htmlFor='password3-input'>Confirm New Password</label>
              <input
                type='password'
                name='password3-input'
                id='password3-input'
                required={true}
                value={password3}
                onChange={(e) => {
                  setPassword3(e.target.value);
                  setPasswordFormError('');
                }}
              />
            </div>

            <input
              type='submit'
              value={passwordFormLoading ? 'Loading' : 'Save'}
              disabled={
                password1 === '' && password2 === '' && password3 === ''
              }
            />
          </form>
        )}
      </div>
      <div className='content-container content-container-md'>
        <h2>Avatar Upload</h2>
        {imageFormError && (
          <Error
            error={imageFormError}
            dismiss={() => {
              setImageFormError('');
            }}
          />
        )}
        <img
          src={image ? image : authenticatedUser && authenticatedUser.avatar}
          alt=''
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        />
        <form
          onSubmit={(e) => {
            handleUpload(e);
          }}
        >
          <div>
            <label htmlFor='image-input'>Avatar</label>
            <input
              type='file'
              id='image'
              name='image'
              onChange={handleImageChange}
            />
          </div>
          <input
            type='submit'
            value={imageFormLoading ? 'Loading' : 'Upload'}
            disabled={imageFormLoading}
          />
        </form>
      </div>
      {/* <div className='content-container content-container-md'>
        <h2>Account Deletion</h2>
        <input
          type='submit'
          value='Delete Account'
          style={{
            backgroundColor: 'var(--negative)',
          }}
          onClick={async () => {
            if (!confirm('Are you sure you want to delete your account?')) {
              return;
            }
            const response = await fetch(`/api/users/me`, {
              method: 'DELETE',
            });
            switch (response.status) {
              case 204:
                navigate('/sign-in');
                break;
              default:
                alert('An unknown error occurred');
            }
          }}
        />
      </div> */}
    </>
  );
}

export default AccountSettings;
