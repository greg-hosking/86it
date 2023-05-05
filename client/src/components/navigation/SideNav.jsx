import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthContext from '../../contexts/AuthContext.jsx';
import RestaurantContext from '../../contexts/RestaurantContext.jsx';

import '../../styles/SideNav.css';

function SideNav() {
  const { authenticatedUser, signOut } = useContext(AuthContext.AuthContext);
  const { currentRestaurant } = useContext(RestaurantContext.RestaurantContext);
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);

  // Redirect to /sign-in if user is not signed in
  useEffect(() => {
    if (!authenticatedUser) {
      navigate('/sign-in');
    }
    // Side nav should be collapsed by default
    const widthCollapsed = getComputedStyle(
      document.documentElement
    ).getPropertyValue('--side-nav-width-collapsed');
    document.documentElement.style.setProperty(
      '--side-nav-width',
      widthCollapsed
    );
    document.getElementById('side-nav').classList.remove('expanded');
  }, [authenticatedUser]);

  return (
    <nav id='side-nav'>
      <Link to='/me/settings'>
        {!authenticatedUser ? (
          <>
            <i className='fas fa-user fa-fw'></i>
            <h3>Loading</h3>
          </>
        ) : (
          <>
            {authenticatedUser.avatar ? (
              <div
                className='avatar'
                style={{
                  backgroundImage: `url(${authenticatedUser.avatar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
            ) : (
              <i className='fas fa-user fa-fw'></i>
            )}
            <h3>Account</h3>
          </>
        )}
      </Link>

      {!currentRestaurant ? (
        <Link to='/me/restaurants'>
          <i className='fas fa-utensils fa-fw'></i>
          <h3>Restaurants</h3>
        </Link>
      ) : (
        <>
          <Link to={`/me/restaurants/${currentRestaurant._id}/menus`}>
            <i className='fas fa-utensils fa-fw'></i>
            <h3>Menus</h3>
          </Link>
          <Link to={`/me/restaurants/${currentRestaurant._id}/users`}>
            <i className='fas fa-users fa-fw'></i>
            <h3>Users</h3>
          </Link>
        </>
      )}
      <Link
        to={`/me${
          currentRestaurant ? '/restaurants/' + currentRestaurant._id : ''
        }/settings`}
      >
        <i className='fa fa-cog fa-fw' />
        <h3>Settings</h3>
      </Link>
      <Link
        onClick={async () => {
          await signOut();
          navigate('/sign-in');
        }}
      >
        <i className='fas fa-sign-out fa-fw' />
        <h3>Sign Out</h3>
      </Link>
      <Link
        onClick={() => {
          const widthCollapsed = getComputedStyle(
            document.documentElement
          ).getPropertyValue('--side-nav-width-collapsed');
          const widthExpanded = getComputedStyle(
            document.documentElement
          ).getPropertyValue('--side-nav-width-expanded');
          document.documentElement.style.setProperty(
            '--side-nav-width',
            expanded ? widthCollapsed : widthExpanded
          );
          document.getElementById('side-nav').classList.toggle('expanded');
          setExpanded(!expanded);
        }}
      >
        <i className='fas fa-chevron-left fa-fw'></i>
        <h3>{expanded ? 'Collapse' : 'Expand'}</h3>
      </Link>
    </nav>
  );
}

export default SideNav;
