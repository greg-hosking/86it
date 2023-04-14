import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

function Restaurants() {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const shouldFetch = useRef(true);

  async function handleAcceptInvite(event, restaurantId) {
    console.log(event.target);
    event.preventDefault();
    fetch(`/api/restaurants/${restaurantId}/users/${userId}/accept`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    window.location.reload();
  }

  async function handleRejectInvite(event, restaurantId) {
    event.preventDefault();
    fetch(`/api/restaurants/${restaurantId}/users/${userId}/reject`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    window.location.reload();
  }

  useEffect(() => {
    async function fetchData() {
      shouldFetch.current = false;

      let response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 401 || response.status === 403) {
        alert('You are not authorized to view this page');
        window.location = '/temp/sign-in';
        return;
      }
      if (response.ok) {
        const data = await response.json();
        document.title = `${data.firstName}'s Restaurants`;
        setUser(data);
        console.log(JSON.stringify(data));
      } else {
        alert('Error fetching user info');
      }

      response = await fetch(`/api/users/${userId}/restaurants`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 401 || response.status === 403) {
        alert('You are not authorized to view this page');
        window.location = '/temp/sign-in';
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
      } else {
        alert('Error fetching restaurants');
      }
    }

    if (shouldFetch.current) {
      fetchData();
    }
  }, []);

  return (
    <div>
      <h1>My Restaurants</h1>
      {restaurants.length === 0 && <p>No restaurants found</p>}
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant._id}>
            <a href={`/temp/users/${userId}/restaurants/${restaurant._id}`}>
              {restaurant.name}
            </a>{' '}
            ({restaurant.role}){' '}
            {restaurant.role === 'pending' && (
              <>
                <span
                  onClick={(e) => {
                    handleAcceptInvite(e, restaurant._id);
                  }}
                  style={{ color: 'green', cursor: 'pointer' }}
                >
                  Accept
                </span>{' '}
                |{' '}
                <span
                  onClick={(e) => {
                    handleRejectInvite(e, restaurant._id);
                  }}
                  style={{ color: 'red', cursor: 'pointer' }}
                >
                  Reject
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
      <br />
      <a href={`/temp/create-restaurant`}>Create a restaurant.</a>
      <br />
      <br />

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const formData = new FormData();
          formData.append('image', event.target[0].files[0]);

          const response = await fetch(`/api/users/${userId}`, {
            method: 'PATCH',
            body: formData,
          });

          if (!response.ok) {
            alert(response.status);
          } else {
            alert('Image uploaded successfully');
          }

          window.location.reload();
        }}
      >
        <h4>Upload profile image</h4>
        <br />
        <img
          src={user.image}
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        />
        <br />
        <input type='file' name='image' />
        <input type='submit' value='Submit' />
      </form>
      <br />
      <p>
        Signed in as {user.firstName} {user.lastName}{' '}
        <span style={{ float: 'right' }}>
          <a
            href='/temp/sign-in'
            onClick={(e) => {
              e.preventDefault();
              fetch('/api/auth', {
                method: 'DELETE',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              });
              window.location = '/temp/sign-in';
            }}
          >
            Sign out.
          </a>
        </span>
      </p>
    </div>
  );
}

export default Restaurants;
