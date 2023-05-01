import { createContext, useContext, useEffect, useState } from 'react';

import AuthContext from './AuthContext.jsx';

const RestaurantContext = createContext({
  restaurants: [],
  currentRestaurant: null,
  handleSetCurrentRestaurant: () => {},
});

const RestaurantProvider = ({ children }) => {
  const { authenticatedUser } = useContext(AuthContext.AuthContext);

  const [restaurants, setRestaurants] = useState([]);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  function handleSetCurrentRestaurant(restaurant) {
    setCurrentRestaurant(restaurant);
    localStorage.setItem('currentRestaurant', JSON.stringify(restaurant));
  }

  async function fetchRestaurants() {
    const response = await fetch('/api/users/me/restaurants', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      setRestaurants([]);
      handleSetCurrentRestaurant(null);
      return;
    }
    const restaurants = await response.json();
    setRestaurants(restaurants);
    const restaurantJSON = localStorage.getItem('currentRestaurant');
    if (!restaurantJSON || restaurantJSON === 'null') {
      handleSetCurrentRestaurant(null);
      return;
    }
    const restaurant = JSON.parse(restaurantJSON);
    // If the current restaurant is not in the list of restaurants,
    // set the current restaurant to null
    if (!restaurants.some((r) => r._id == restaurant._id)) {
      handleSetCurrentRestaurant(null);
      return;
    }
    handleSetCurrentRestaurant(restaurant);
  }

  // Fetch restaurants whenever the authenticated user changes
  useEffect(() => {
    if (!authenticatedUser) {
      setRestaurants([]);
      handleSetCurrentRestaurant(null);
      return;
    }
    fetchRestaurants();
  }, [authenticatedUser]);

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        currentRestaurant,
        handleSetCurrentRestaurant,
        fetchRestaurants,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export default { RestaurantContext, RestaurantProvider };
