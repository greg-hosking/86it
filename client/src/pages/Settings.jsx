import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext.jsx';

function Settings() {
  const { authenticatedUser, signOut } = useContext(AuthContext.AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticatedUser) {
      navigate('/sign-in');
    }
  }, [authenticatedUser]);

  return (
    <div className='content-container content-container-lg'>
      <h2>My Settings</h2>
    </div>
  );
}

export default Settings;
