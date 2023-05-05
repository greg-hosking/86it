import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthContext from '../../contexts/AuthContext.jsx';
import RestaurantContext from '../../contexts/RestaurantContext.jsx';

import '../../styles/BottomNav.css';

function BottomNav() {
  const { authenticatedUser, signOut } = useContext(AuthContext.AuthContext);
  const { currentRestaurant } = useContext(RestaurantContext.RestaurantContext);
  const navigate = useNavigate();

  // Redirect to /sign-in if user is not signed in
  useEffect(() => {
    if (!authenticatedUser) {
      navigate('/sign-in');
    }
  }, [authenticatedUser]);

  return (
    <nav id='bottom-nav'>
      <Link to='/me/settings'>
        {!authenticatedUser ? (
          <i className='fas fa-user fa-fw'></i>
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
          </>
        )}
      </Link>

      {!currentRestaurant ? (
        <Link to='/me/restaurants'>
          <i className='fas fa-utensils fa-fw'></i>
        </Link>
      ) : (
        <>
          <Link to={`/me/restaurants/${currentRestaurant._id}/menus`}>
            <i className='fas fa-utensils fa-fw'></i>
          </Link>
          <Link to={`/me/restaurants/${currentRestaurant._id}/users`}>
            <i className='fas fa-users fa-fw'></i>
          </Link>
        </>
      )}
      <Link
        to={`/me${
          currentRestaurant ? '/restaurants/' + currentRestaurant._id : ''
        }/settings`}
      >
        <i className='fa fa-cog fa-fw' />
      </Link>
      <Link
        onClick={async () => {
          await signOut();
          navigate('/sign-in');
        }}
      >
        <i className='fas fa-sign-out fa-fw' />
      </Link>
    </nav>
  );
}

export default BottomNav;
