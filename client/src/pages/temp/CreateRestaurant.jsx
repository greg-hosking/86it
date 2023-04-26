import React, { useState } from 'react';

function CreateRestaurant() {
  const [name, setName] = useState('');
  const [street1, setStreet1] = useState('');
  const [street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('AL');
  const [zip, setZip] = useState('');

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const response = await fetch('/api/restaurants', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: name,
              address: {
                street1: street1,
                street2: street2,
                city: city,
                state: state,
                zip: zip,
              },
            }),
          });

          if (response.ok) {
            const responseJson = await response.json();
            window.location = `/temp/users/${responseJson.ownerId}/restaurants`;
            return;
          }

          alert(await response.text());
        }}
      >
        <h1>Create Restaurant</h1>
        <div>
          <label htmlFor='name'>Restaurant Name</label>
          <input
            type='text'
            name='name'
            id='name'
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='street1'>Street Address 1</label>
          <input
            type='text'
            name='street1'
            id='street1'
            required
            value={street1}
            onChange={(e) => setStreet1(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='street2'>Street Address 2</label>
          <input
            type='text'
            name='street2'
            id='street2'
            value={street2}
            onChange={(e) => setStreet2(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='city'>City</label>
          <input
            type='text'
            name='city'
            id='city'
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='state'>State</label>
          <select
            name='state'
            id='state'
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
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
          <label htmlFor='zip'>Zip Code</label>
          <input
            type='text'
            name='zip'
            id='zip'
            required
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </div>
        <input type='submit' value='Submit' />
      </form>
    </div>
  );
}

export default CreateRestaurant;
