import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import UserListItem from '../../components/UserListItem';

function Restaurant() {
  const { userId, restaurantId } = useParams();

  const [restaurant, setRestaurant] = useState({});
  const shouldFetch = useRef(true);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');

  async function handleRestaurantFormSubmit(event) {
    event.preventDefault();
    const response = await fetch(`/api/restaurants/${restaurantId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: restaurant.name,
        address: restaurant.address,
      }),
    });
    const data = await response.json();
    setRestaurant(data);
  }

  async function handleImageUpload(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', event.target.image.files[0]);
    const response = await fetch(`/api/restaurants/${restaurantId}/image`, {
      method: 'PUT',
      body: formData,
    });
    const data = await response.json();
    setRestaurant(data);
    window.location.reload();
  }

  async function handleInviteSubmit(event) {
    event.preventDefault();
    const response = await fetch(`/api/restaurants/${restaurantId}/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    if (!response.ok) {
      alert('Error sending invite');
      return;
    }
    alert('Invite sent');
  }

  useEffect(() => {
    async function fetchData() {
      shouldFetch.current = false;
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        alert('Error fetching restaurant');
        return;
      }

      const data = await response.json();
      setRestaurant(data);

      setLoading(false);
    }

    if (shouldFetch.current) {
      fetchData();
    }
  }, []);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <h2>Restaurant Info</h2>
          <form onSubmit={(e) => handleRestaurantFormSubmit(e)}>
            <div>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                id='name'
                name='name'
                required={true}
                value={restaurant.name}
                onChange={(e) => {
                  setRestaurant({ ...restaurant, name: e.target.value });
                }}
              />
            </div>
            <div>
              <label htmlFor='street1'>Street 1</label>
              <input
                type='text'
                id='street1'
                name='street1'
                required={true}
                value={restaurant.address.street1}
                onChange={(e) => {
                  setRestaurant({
                    ...restaurant,
                    address: {
                      ...restaurant.address,
                      street1: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div>
              <label htmlFor='street2'>Street 2</label>
              <input
                type='text'
                id='street2'
                name='street2'
                value={restaurant.address.street2}
                onChange={(e) => {
                  setRestaurant({
                    ...restaurant,
                    address: {
                      ...restaurant.address,
                      street2: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div>
              <label htmlFor='city'>City</label>
              <input
                type='text'
                id='city'
                name='city'
                required={true}
                value={restaurant.address.city}
                onChange={(e) => {
                  setRestaurant({
                    ...restaurant,
                    address: {
                      ...restaurant.address,
                      city: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div>
              <label htmlFor='state'>State</label>
              <select
                id='state'
                name='state'
                required={true}
                value={restaurant.address.state}
                onChange={(e) => {
                  setRestaurant({
                    ...restaurant,
                    address: {
                      ...restaurant.address,
                      state: e.target.value,
                    },
                  });
                }}
              >
                <option value='AL'>Alabama</option>
                <option value='AK'>Alaska</option>
                <option value='AZ'>Arizona</option>
                <option value='AR'>Arkansas</option>
                <option value='CA'>California</option>
                <option value='CO'>Colorado</option>
                <option value='CT'>Connecticut</option>
                <option value='DE'>Delaware</option>
                <option value='FL'>Florida</option>
                <option value='GA'>Georgia</option>
                <option value='HI'>Hawaii</option>
                <option value='ID'>Idaho</option>
                <option value='IL'>Illinois</option>
                <option value='IN'>Indiana</option>
                <option value='IA'>Iowa</option>
                <option value='KS'>Kansas</option>
                <option value='KY'>Kentucky</option>
                <option value='LA'>Louisiana</option>
                <option value='ME'>Maine</option>
                <option value='MD'>Maryland</option>
                <option value='MA'>Massachusetts</option>
                <option value='MI'>Michigan</option>
                <option value='MN'>Minnesota</option>
                <option value='MS'>Mississippi</option>
                <option value='MO'>Missouri</option>
                <option value='MT'>Montana</option>
                <option value='NE'>Nebraska</option>
                <option value='NV'>Nevada</option>
                <option value='NH'>New Hampshire</option>
                <option value='NJ'>New Jersey</option>
                <option value='NM'>New Mexico</option>
                <option value='NY'>New York</option>
                <option value='NC'>North Carolina</option>
                <option value='ND'>North Dakota</option>
                <option value='OH'>Ohio</option>
                <option value='OK'>Oklahoma</option>
                <option value='OR'>Oregon</option>
                <option value='PA'>Pennsylvania</option>
                <option value='RI'>Rhode Island</option>
                <option value='SC'>South Carolina</option>
                <option value='SD'>South Dakota</option>
                <option value='TN'>Tennessee</option>
                <option value='TX'>Texas</option>
                <option value='UT'>Utah</option>
                <option value='VT'>Vermont</option>
                <option value='VA'>Virginia</option>
                <option value='WA'>Washington</option>
                <option value='WV'>West Virginia</option>
                <option value='WI'>Wisconsin</option>
                <option value='WY'>Wyoming</option>
              </select>
            </div>
            <div>
              <label htmlFor='zip'>Zip</label>
              <input
                type='text'
                id='zip'
                name='zip'
                required={true}
                value={restaurant.address.zip}
                onChange={(e) => {
                  setRestaurant({
                    ...restaurant,
                    address: {
                      ...restaurant.address,
                      zip: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <input type='submit' value='Save' />
          </form>
          <br />

          <h2>Restaurant Image</h2>
          <form
            onSubmit={(e) => {
              handleImageUpload(e);
            }}
          >
            <div>
              <label htmlFor='image'>Image</label>
              <img
                src={restaurant.image}
                alt='Image'
                style={{ maxWidth: '400px', maxHeight: '400px' }}
              />
              <input type='file' id='image' name='image' />
            </div>
            <input type='submit' value='Save' />
          </form>

          <br />
          <h2>Users</h2>
          <form
            onSubmit={(e) => {
              handleInviteSubmit(e);
            }}
          >
            <ul>
              {restaurant.users.map((user) => (
                <UserListItem key={user.userId} user={user} />
              ))}
            </ul>
            <div>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                name='email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <input type='submit' value='Invite User' />
          </form>
        </>
      )}
      <br />
      <a href={`/temp/users/${userId}/restaurants`}>Go back.</a>
    </div>
  );
}

export default Restaurant;
