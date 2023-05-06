import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext.jsx';
import RestaurantContext from '../contexts/RestaurantContext.jsx';

import Modal from '../components/Modal.jsx';

function Menus() {
  const { authenticatedUser } = useContext(AuthContext.AuthContext);
  const { currentRestaurant } = useContext(RestaurantContext.RestaurantContext);
  const navigate = useNavigate();

  const [menus, setMenus] = useState([]);
  const shouldFetch = useRef(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [error, setError] = useState(null);
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

    async function fetchMenus() {
      const response = await fetch(
        `/api/users/me/restaurants/${currentRestaurant._id}/menus`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        setMenus([]);
        return;
      }
      const menus = await response.json();
      setMenus(menus);
    }
    fetchMenus();
  }, [authenticatedUser, currentRestaurant]);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        toggleOpen={() => setIsModalOpen(!isModalOpen)}
      >
        <form
          style={{
            boxSizing: 'border-box',
            padding: '0 1rem',
          }}
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            const response = await fetch(
              `/api/users/me/restaurants/${currentRestaurant._id}/menus`,
              {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: newMenuName,
                }),
              }
            );
            setLoading(false);
            if (!response.ok) {
              setError('Error creating menu');
              return;
            }
            const menu = await response.json();
            setMenus([...menus, menu]);
            setNewMenuName('');
            navigate(
              `/me/restaurants/${currentRestaurant._id}/menus/${menu._id}`
            );
          }}
        >
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            name='name'
            value={newMenuName}
            onChange={(e) => setNewMenuName(e.target.value)}
          />
          <input
            type='submit'
            value={loading ? 'Loading...' : 'Create New Menu'}
          />
        </form>
      </Modal>
      <div className='content-container content-container-lg'>
        {currentRestaurant && (
          <>
            <h2>Menus</h2>
            {menus && menus.length > 0 && (
              <ul
                style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0',
                  width: '100%',
                }}
              >
                {menus.map((menu) => (
                  <li
                    key={menu._id}
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
                    <p>
                      <strong>{menu.name}</strong>
                    </p>

                    <Link
                      to={`/me/restaurants/${currentRestaurant._id}/menus/${menu._id}`}
                      style={{
                        color: 'var(--text)',
                        marginLeft: 'auto',
                      }}
                    >
                      <i className='fas fa-chevron-right'></i>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {authenticatedUser &&
              authenticatedUser.restaurants &&
              authenticatedUser.restaurants.find(
                (r) => r.restaurantId == currentRestaurant._id
              ) &&
              authenticatedUser.restaurants.find(
                (r) => r.restaurantId == currentRestaurant._id
              ).role >= 'manager' && (
                <input
                  type='submit'
                  value='Add Menu'
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                  style={{
                    marginTop: '1rem',
                    marginBottom: '0',
                  }}
                />
              )}
          </>
        )}
      </div>
    </>
  );
}

export default Menus;
