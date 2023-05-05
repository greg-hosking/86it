import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext.jsx';
import RestaurantContext from '../contexts/RestaurantContext.jsx';

import Error from '../components/Error.jsx';

import UserCard from '../components/UserCard.jsx';

function Users() {
  const { authenticatedUser } = useContext(AuthContext.AuthContext);
  const { currentRestaurant } = useContext(RestaurantContext.RestaurantContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const shouldFetch = useRef(true);

  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('employee');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authenticatedUser) {
      navigate('/sign-in');
      return;
    }
    if (!currentRestaurant) {
      navigate('/me/restaurants');
      return;
    }

    async function fetchUsers() {
      const response = await fetch(
        `/api/users/me/restaurants/${currentRestaurant._id}/users`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setUsers(data);
    }
    if (shouldFetch.current) {
      fetchUsers();
      shouldFetch.current = false;
    }
  }, [authenticatedUser, currentRestaurant, users]);

  return (
    <div className='content-container content-container-lg'>
      {authenticatedUser && currentRestaurant && (
        <>
          <h2>{currentRestaurant ? currentRestaurant.name : ''} Users</h2>
          <ul
            style={{
              width: '100%',
              marginBottom: '1rem',
            }}
          >
            {users
              .filter((user) => user.role === 'owner')
              .map((user) => {
                return (
                  <UserCard
                    key={user._id}
                    user={user}
                    authenticatedUserRole={
                      authenticatedUser.restaurants.find(
                        (restaurant) =>
                          restaurant.restaurantId == currentRestaurant._id
                      ).role
                    }
                    onRemove={() => {
                      setUsers(users.filter((u) => u._id !== user._id));
                      shouldFetch.current = true;
                    }}
                  />
                );
              })}
            {users
              .filter((user) => user.role === 'manager')
              .map((user) => {
                return (
                  <UserCard
                    key={user._id}
                    user={user}
                    authenticatedUserRole={
                      authenticatedUser.restaurants.find(
                        (restaurant) =>
                          restaurant.restaurantId == currentRestaurant._id
                      ).role
                    }
                    onRemove={() => {
                      setUsers(users.filter((u) => u._id !== user._id));
                      shouldFetch.current = true;
                    }}
                  />
                );
              })}
            {users
              .filter((user) => user.role === 'employee')
              .map((user) => {
                return (
                  <UserCard
                    key={user._id}
                    user={user}
                    authenticatedUserRole={
                      authenticatedUser.restaurants.find(
                        (restaurant) =>
                          restaurant.restaurantId == currentRestaurant._id
                      ).role
                    }
                    onRemove={() => {
                      setUsers(users.filter((u) => u._id !== user._id));
                      shouldFetch.current = true;
                    }}
                  />
                );
              })}
          </ul>

          {authenticatedUser.restaurants.find(
            (restaurant) => restaurant.restaurantId == currentRestaurant._id
          ).role >= 'manager' && (
            <>
              {error && <Error error={error} dismiss={() => setError('')} />}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  const response = await fetch(
                    `/api/users/me/restaurants/${currentRestaurant._id}/users`,
                    {
                      method: 'POST',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        email: newUserEmail,
                        role: newUserRole,
                      }),
                    }
                  );
                  switch (response.status) {
                    case 403:
                      setError('Forbidden');
                      setLoading(false);
                      return;
                    case 404:
                      setError('User not found');
                      setLoading(false);
                      return;
                    case 409:
                      setError('User already exists');
                      setLoading(false);
                      return;
                    case 500:
                      setError('An unknown error occurred');
                      setLoading(false);
                      return;
                  }
                  setError('');
                  const newUser = await response.json();
                  setUsers([...users, newUser]);
                  setNewUserEmail('');
                  shouldFetch.current = true;
                  setLoading(false);
                }}
                style={{
                  width: '100%',
                }}
              >
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  name='email'
                  id='email'
                  required={true}
                  onChange={(e) => {
                    setNewUserEmail(e.target.value);
                    setError('');
                  }}
                  value={newUserEmail}
                />
                <label htmlFor='role'>Role</label>
                <select
                  name='role'
                  id='role'
                  value={newUserRole}
                  onChange={(e) => {
                    setNewUserRole(e.target.value);
                    setError('');
                  }}
                >
                  {authenticatedUser.restaurants.find(
                    (restaurant) =>
                      restaurant.restaurantId == currentRestaurant._id
                  ).role === 'owner' && (
                    <option value='manager'>Manager</option>
                  )}

                  {authenticatedUser.restaurants.find(
                    (restaurant) =>
                      restaurant.restaurantId == currentRestaurant._id
                  ).role >= 'manager' && (
                    <option value='employee'>Employee</option>
                  )}
                </select>
                <input
                  type='submit'
                  value={loading ? 'Loading...' : 'Invite New User'}
                  style={{
                    marginBottom: '0',
                  }}
                />
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Users;
