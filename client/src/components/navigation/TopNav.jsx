import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthContext from '../../contexts/AuthContext.jsx';
import RestaurantsDropdown from '../RestaurantsDropdown.jsx';

import '../../styles/TopNav.css';

function TopNav() {
  const { authenticatedUser, signOut } = useContext(AuthContext.AuthContext);
  const navigate = useNavigate();

  // Redirect to /sign-in if user is not signed in
  useEffect(() => {
    if (!authenticatedUser) {
      navigate('/sign-in');
    }
  }, [authenticatedUser]);

  return (
    <nav id='top-nav'>
      <Link to='/me/restaurants'>
        <h1>86it</h1>
      </Link>
      <RestaurantsDropdown />
    </nav>
  );
}

export default TopNav;
