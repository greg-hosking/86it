import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext.jsx';
import RestaurantContext from '../contexts/RestaurantContext.jsx';

function Restaurants() {
  const { authenticatedUser } = useContext(AuthContext.AuthContext);
  const { restaurants, currentRestaurant, handleSetCurrentRestaurant } =
    useContext(RestaurantContext.RestaurantContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticatedUser) {
      navigate('/sign-in');
    }
  }, [authenticatedUser]);

  return (
    <div className='content-container content-container-lg'>
      <h2>My Restaurants</h2>

      {restaurants.length === 0 && <p>No restaurants found</p>}
      <ul
        style={{
          listStyle: 'none',
          padding: '0',
          margin: '0',
          width: '100%',
        }}
      >
        {restaurants.map((restaurant) => (
          <li
            key={restaurant._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '0.5rem',
              marginBottom: '0.5rem',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                backgroundImage: `url(${restaurant.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
            <div>
              <h3
                style={{
                  marginBottom: '0.25rem',
                }}
              >
                {restaurant.name}
              </h3>
              <p>{restaurant.address.street1}</p>
              <p>
                {restaurant.users.map((user) => {
                  if (user.userId == authenticatedUser._id) {
                    return (
                      user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    );
                  }
                })}
              </p>
            </div>
            <Link
              to={`/me/restaurants/${restaurant._id}/menus`}
              style={{
                marginLeft: 'auto',
                color: 'var(--text)',
              }}
              onClick={() => {
                handleSetCurrentRestaurant(restaurant);
              }}
            >
              <i className='fas fa-edit'></i>
            </Link>
            <Link
              to={`/me/restaurants/${restaurant._id}/settings`}
              style={{
                color: 'var(--text)',
              }}
              onClick={() => {
                handleSetCurrentRestaurant(restaurant);
              }}
            >
              <i className='fas fa-gear'></i>
            </Link>
          </li>
        ))}
      </ul>

      <input
        type='submit'
        value='Create New Restaurant'
        style={{
          marginBottom: '0',
          marginTop: '1rem',
        }}
      />
    </div>
  );
}

export default Restaurants;
