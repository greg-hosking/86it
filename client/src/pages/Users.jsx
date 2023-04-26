import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext.jsx';

function Users() {
  const { authenticatedUser, signOut } = useContext(AuthContext.AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticatedUser) {
      navigate('/sign-in');
    }
  }, [authenticatedUser]);

  return (
    <div className='content-container content-container-lg'>
      <h2>My Users</h2>
    </div>
  );
}

export default Users;
