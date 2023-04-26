import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext.jsx';

export default function Sidenav() {
  const { authenticatedUser, signOut } = useContext(AuthContext.AuthContext);
  const navigate = useNavigate();

  // Redirect to /sign-in if user is not signed in
  useEffect(() => {
    if (!authenticatedUser) {
      navigate('/sign-in');
    }
  }, [authenticatedUser]);

  return (
    <nav id='sidenav'>
      <Link to='/me/settings' id='nav-user'>
        {!authenticatedUser ? (
          <>
            <img
              src='https://s3.amazonaws.com/chat.js/icons/user.png'
              draggable={false}
            />
            <h3>Loading</h3>
          </>
        ) : (
          <>
            <img
              src={authenticatedUser.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://s3.amazonaws.com/chat.js/icons/user.png';
              }}
              draggable={false}
            />
            <h3>
              {authenticatedUser.firstName} {authenticatedUser.lastName}
            </h3>
          </>
        )}
      </Link>
      <Link to='/me/settings' id='nav-user-mobile' className='nav-item'>
        {!authenticatedUser ? (
          <img
            src='https://s3.amazonaws.com/chat.js/icons/user.png'
            draggable={false}
          />
        ) : (
          <>
            <img
              src={authenticatedUser.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://s3.amazonaws.com/chat.js/icons/user.png';
              }}
              draggable={false}
            />
          </>
        )}
      </Link>
      <Link to='/me/restaurants/:restaurantId/menus' className='nav-item'>
        <img
          src='https://s3.amazonaws.com/chat.js/icons/rooms.png'
          draggable={false}
        />
        <h3>Menus</h3>
      </Link>
      <Link to='/me/restaurants/:restaurantId/users' className='nav-item'>
        <img
          src='https://s3.amazonaws.com/chat.js/icons/friends.png'
          draggable={false}
        />
        <h3>Users</h3>
      </Link>
      <Link to='/me/settings' className='nav-item'>
        <img
          src='https://s3.amazonaws.com/chat.js/icons/settings.png'
          draggable={false}
        />
        <h3>Settings</h3>
      </Link>
      <Link to='/sign-in' className='nav-item' onClick={signOut}>
        <img
          src='https://s3.amazonaws.com/chat.js/icons/sign-out.png'
          draggable={false}
        />
        <h3>Sign Out</h3>
      </Link>
    </nav>
  );
}
