import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import RestaurantContext from '../contexts/RestaurantContext.jsx';

import '../styles/RestaurantsDropdown.css';

const RestaurantsDropdown = () => {
  const { restaurants, currentRestaurant, handleSetCurrentRestaurant } =
    useContext(RestaurantContext.RestaurantContext);
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);
  const dropdownRef = useRef(null);

  function handleClickOutside(e) {
    if (expanded && !dropdownRef.current.contains(e.target)) {
      document
        .getElementById('restaurants-dropdown')
        .classList.remove('expanded');
      setExpanded(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded]);

  return (
    <div ref={dropdownRef}>
      <div id='restaurants-dropdown'>
        <div
          id='restaurants-dropdown-selected-item'
          onClick={() => {
            document
              .getElementById('restaurants-dropdown')
              .classList.toggle('expanded');
            setExpanded(!expanded);
          }}
        >
          {currentRestaurant ? (
            <>
              <img src={currentRestaurant.image} draggable={false} />
              <div>
                <b>{currentRestaurant.name}</b>
                <p>{currentRestaurant.address.street1}</p>
              </div>
            </>
          ) : (
            <b>My Restaurants</b>
          )}
          {restaurants.length > 0 && <i className='fas fa-chevron-down'></i>}
        </div>
      </div>
      {expanded && (
        <ul id='restaurants-dropdown-list'>
          {restaurants
            .filter((restaurant) => restaurant._id !== currentRestaurant?._id)
            .map((restaurant) => (
              <li
                key={restaurant._id}
                onClick={() => {
                  handleSetCurrentRestaurant(restaurant);
                  document
                    .getElementById('restaurants-dropdown')
                    .classList.remove('expanded');
                  setExpanded(false);
                  navigate(`/me/restaurants/${restaurant._id}/menus`);
                }}
              >
                <img src={restaurant.image} draggable={false} />
                <div>
                  <b>{restaurant.name}</b>
                  <p>{restaurant.address.street1}</p>
                </div>
              </li>
            ))}
          {currentRestaurant && (
            <li
              onClick={() => {
                handleSetCurrentRestaurant(null);
                document
                  .getElementById('restaurants-dropdown')
                  .classList.remove('expanded');
                setExpanded(false);
              }}
            >
              <b>My Restaurants</b>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default RestaurantsDropdown;
