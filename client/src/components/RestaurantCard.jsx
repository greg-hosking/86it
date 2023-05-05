import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import RestaurantContext from '../contexts/RestaurantContext.jsx';

import Modal from '../components/Modal.jsx';
import QRCodeGenerator from '../components/QRCodeGenerator.jsx';

import '../styles/RestaurantCard.css';

function RestaurantCard({ restaurant, onAccept, onDecline }) {
  const { handleSetCurrentRestaurant } = useContext(
    RestaurantContext.RestaurantContext
  );
  const navigate = useNavigate();

  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

  return (
    <>
      <Modal
        isOpen={isQRCodeModalOpen}
        toggleOpen={() => {
          setIsQRCodeModalOpen(!isQRCodeModalOpen);
        }}
      >
        <h2>{restaurant.name} QR Code</h2>
        <QRCodeGenerator
          text={
            window.location.href.includes('localhost')
              ? `http://localhost:3000/restaurants/${restaurant._id}`
              : `https://eightysixit.herokuapp.com/restaurants/${restaurant._id}`
          }
        />
      </Modal>
      {true ? (
        <div className='restaurant-card'>
          <div
            className='restaurant-card-logo'
            style={{
              backgroundImage: `url(${restaurant.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          <div>
            <h3>{restaurant.name}</h3>
            <p>{restaurant.address.street1}</p>
            <p>
              {restaurant.role.charAt(0).toUpperCase() +
                restaurant.role.slice(1)}
            </p>
          </div>
          {restaurant.status === 'pending' ? (
            <>
              <i
                className='fas fa-x'
                onClick={async () => {
                  const response = await fetch(
                    `/api/users/me/restaurants/${restaurant._id}`,
                    {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    }
                  );
                  onDecline();
                }}
              ></i>
              <i
                className='fas fa-check'
                onClick={async () => {
                  const response = await fetch(
                    `/api/users/me/restaurants/${restaurant._id}`,
                    {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    }
                  );
                  onAccept();
                }}
              ></i>
            </>
          ) : (
            <>
              <i
                className='fas fa-qrcode'
                onClick={() => {
                  setIsQRCodeModalOpen(true);
                }}
              ></i>
              <i
                className='fas fa-chevron-right'
                onClick={() => {
                  handleSetCurrentRestaurant(restaurant);
                  navigate(`/me/restaurants/${restaurant._id}/menus`);
                }}
              ></i>
            </>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default RestaurantCard;
