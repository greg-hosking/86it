import React, { useContext, useState } from 'react';

import RestaurantContext from '../contexts/RestaurantContext.jsx';

import '../styles/UserCard.css';

function UserCard({ user, authenticatedUserRole, onRemove }) {
  const { currentRestaurant } = useContext(RestaurantContext.RestaurantContext);

  return (
    <div className='user-card'>
      <div
        className='user-card-avatar'
        style={{
          backgroundImage: `url(${user.avatar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div>
        <h1></h1>
        <h3>
          {user.firstName} {user.lastName}
        </h3>
        <p>{user.email}</p>
        <p
          style={{
            color: 'var(--text-subdued)',
          }}
        >
          {user.status === 'pending' &&
            user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </p>
        {authenticatedUserRole > user.role ? (
          <select
            name='role'
            id='role'
            defaultValue={user.role}
            onChange={async (e) => {
              if (e.target.value === 'none') {
                if (!confirm('Are you sure you want to remove this user?')) {
                  return;
                }
                await fetch(
                  `/api/users/me/restaurants/${currentRestaurant._id}/users/${user._id}`,
                  {
                    method: 'DELETE',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                  }
                );
                onRemove(user._id);
                return;
              }

              await fetch(
                `/api/users/me/restaurants/${currentRestaurant._id}/users/${user._id}`,
                {
                  method: 'PATCH',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    role: e.target.value,
                  }),
                }
              );
            }}
          >
            {/* {authenticatedUserRole === 'owner' && (
                  <option value='owner'>Owner</option>
                )} */}
            {(authenticatedUserRole === 'owner' ||
              authenticatedUserRole === 'manager') && (
              <option value='manager'>Manager</option>
            )}
            <option value='employee'>Employee</option>
            <option value='none'>None</option>
          </select>
        ) : (
          <p>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
        )}
      </div>
    </div>
  );
}

export default UserCard;
