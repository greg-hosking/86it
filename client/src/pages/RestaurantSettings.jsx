import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext.jsx';
import RestaurantContext from '../contexts/RestaurantContext.jsx';

import Error from '../components/Error.jsx';

function RestaurantSettings() {
  const { authenticatedUser } = useContext(AuthContext.AuthContext);
  const { currentRestaurant } = useContext(RestaurantContext.RestaurantContext);
  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState('');
  const [street1, setStreet1] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const [restaurantFormLoading, setRestaurantFormLoading] = useState(false);
  const [restaurantFormError, setRestaurantFormError] = useState('');
  const [imageFormLoading, setImageFormLoading] = useState(false);
  const [imageFormError, setImageFormError] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setRestaurantFormLoading(true);
    const response = await fetch(
      `/api/users/me/restaurants/${currentRestaurant._id}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: restaurantName,
          address: {
            street1: street1,
            street2: street2,
            city: city,
            state: state,
            zip: zip,
          },
        }),
      }
    );
    switch (response.status) {
      case 204:
        setRestaurantFormError('');
        break;
      default:
        setRestaurantFormError('An unknown error occurred');
    }
    setRestaurantFormLoading(false);
    alert('Restaurant saved successfully');
  }

  async function handleUpload(e) {
    e.preventDefault();
    setImageFormLoading(true);
    const formData = new FormData();
    formData.append('image', e.target.image.files[0]);
    const response = await fetch(
      `/api/users/me/restaurants/${currentRestaurant._id}/image`,
      {
        method: 'PUT',
        body: formData,
      }
    );
    switch (response.status) {
      case 204:
        setImageFormError('');
        break;
      default:
        setImageFormError('An unknown error occurred');
    }
    setImageFormLoading(false);
    alert('Image uploaded successfully');
  }

  useEffect(() => {
    if (!authenticatedUser) {
      navigate('/sign-in');
      return;
    }
    if (!currentRestaurant) {
      navigate('/me/restaurants');
      return;
    }
    setRestaurantName(currentRestaurant.name);
    setStreet1(currentRestaurant.address.street1);
    setStreet2(currentRestaurant.address.street2 || '');
    setCity(currentRestaurant.address.city);
    setState(currentRestaurant.address.state);
    setZip(currentRestaurant.address.zip);
  }, [authenticatedUser, currentRestaurant]);

  return (
    <>
      <div className='content-container content-container-md'>
        <h2>Restaurant Settings</h2>
        {restaurantFormError && (
          <Error
            error={restaurantFormError}
            dismiss={() => {
              setError('');
            }}
          />
        )}
        {currentRestaurant && (
          <form
            onSubmit={(e) => {
              handleSave(e);
            }}
          >
            <div>
              <label htmlFor='restaurant-name-input'>Restaurant Name</label>
              <input
                type='text'
                name='restaurant-name-input'
                id='restaurant-name-input'
                required={true}
                value={restaurantName}
                onChange={(e) => {
                  setRestaurantName(e.target.value);
                  setRestaurantFormError('');
                }}
              />
            </div>
            <div>
              <label htmlFor='street1-input'>Street Address 1</label>
              <input
                type='text'
                name='street1-input'
                id='street1-input'
                required={true}
                value={street1}
                onChange={(e) => {
                  setStreet1(e.target.value);
                  setRestaurantFormError('');
                }}
              />
            </div>
            <div>
              <label htmlFor='street2-input'>Street Address 2</label>
              <input
                type='text'
                name='street2-input'
                id='street2-input'
                value={street2}
                onChange={(e) => {
                  setStreet2(e.target.value);
                  setRestaurantFormError('');
                }}
              />
            </div>
            <div>
              <label htmlFor='city-input'>City</label>
              <input
                type='text'
                name='city-input'
                id='city-input'
                required={true}
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setRestaurantFormError('');
                }}
              />
            </div>
            <div>
              <label htmlFor='state-input'>State</label>
              <select
                name='state-input'
                id='state-input'
                required={true}
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setRestaurantFormError('');
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
              <label htmlFor='zip-input'>Zip Code</label>
              <input
                type='text'
                name='zip-input'
                id='zip-input'
                required={true}
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value);
                  setRestaurantFormError('');
                }}
              />
            </div>
            <div>
              <input
                type='submit'
                value={restaurantFormLoading ? 'Loading' : 'Save'}
                disabled={
                  restaurantFormLoading ||
                  (restaurantName === currentRestaurant.name &&
                    street1 === currentRestaurant.address.street1 &&
                    street2 === currentRestaurant.address.street2 &&
                    city === currentRestaurant.address.city &&
                    state === currentRestaurant.address.state &&
                    zip === currentRestaurant.address.zip)
                }
              />
            </div>
          </form>
        )}
      </div>
      <div className='content-container content-container-md'>
        <h2>Image Upload</h2>
        {imageFormError && (
          <Error
            error={imageFormError}
            dismiss={() => {
              setImageFormError('');
            }}
          />
        )}
        <img
          src={currentRestaurant && currentRestaurant.image}
          alt=''
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        />
        <form
          onSubmit={(e) => {
            handleUpload(e);
          }}
        >
          <div>
            <label htmlFor='image-input'>Image</label>
            <input type='file' id='image' name='image' />
          </div>
          <input
            type='submit'
            value={imageFormLoading ? 'Loading' : 'Upload'}
            disabled={imageFormLoading}
          />
        </form>
      </div>
      {/* <div className='content-container content-container-md'>
        <h2>Restaurant Deletion</h2>
        <input
          type='submit'
          value='Delete Restaurant'
          style={{
            backgroundColor: 'var(--negative)',
          }}
          onClick={() => {
            alert('Not implemented yet');
          }}
        />
      </div> */}
    </>
  );
}

export default RestaurantSettings;
