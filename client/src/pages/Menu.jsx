import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Menu() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const shouldFetch = useRef(true);

  useEffect(() => {
    async function fetchRestaurant() {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      switch (response.status) {
        case 200:
          const restaurant = await response.json();
          setRestaurant(restaurant);
          break;
        case 404:
        default:
          setRestaurant(null);
      }
    }
    if (shouldFetch.current) {
      fetchRestaurant();
      shouldFetch.current = false;
    }
  }, []);

  return (
    <>
      {restaurant ? (
        <div
          className='content-container content-container-xl'
          style={{
            padding: '0',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '10rem',
              padding: 0,
              margin: 0,
              backgroundImage: `url(${restaurant.image})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          ></div>
          <div
            style={{
              padding: '1rem',
              width: '100%',
              margin: '0 auto',
              boxSizing: 'border-box',
              // margin: '0 auto',
            }}
          >
            <h1
              style={{
                textAlign: 'left',
              }}
            >
              {restaurant.name}
            </h1>
            <p>
              {restaurant.address.street1}, {restaurant.address.city}
            </p>
            <p
              style={{
                color: 'var(--positive)',
              }}
            >
              Open now
            </p>

            <div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '1rem',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: 'var(--primary)',
                  position: 'sticky',
                  top: '0',
                }}
              >
                {restaurant.menus.map((menu, index) => (
                  <div
                    key={menu._id}
                    style={{
                      padding: '0.5rem',
                    }}
                  >
                    <a
                      onClick={() => {
                        document
                          .getElementById(
                            `${menu.name.split(' ')[0].toLowerCase()}`
                          )
                          .scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest',
                          });
                      }}
                    >
                      {menu.name}
                    </a>
                  </div>
                ))}
              </div>
              {restaurant.menus.map((menu) => (
                <>
                  <h2>{menu.name}</h2>
                  <div
                    id={`${menu.name.split(' ')[0].toLowerCase()}`}
                    key={menu._id}
                  >
                    {menu.sections.map((section) => (
                      <div key={section._id}>
                        <h3>
                          <u>{section.name}</u>
                        </h3>
                        <div>
                          {section.items.map((item, index) => (
                            <div
                              key={item._id}
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                opacity: item.available ? 1 : 0.5,
                                margin: '1rem 0',
                              }}
                            >
                              <div
                                style={{
                                  width: '15rem',
                                }}
                              >
                                <h4>{item.name}</h4>
                                <p>{item.description}</p>
                                <p>${item.price}</p>
                                {item.ingredients.map((ingredient) => (
                                  <span
                                    style={{
                                      fontSize: '0.9rem',
                                    }}
                                  >
                                    {ingredient}{' '}
                                  </span>
                                ))}
                              </div>
                              <div
                                style={{
                                  backgroundImage: `url(${item.image})`,
                                  backgroundPosition: 'center',
                                  backgroundSize: 'cover',
                                  backgroundRepeat: 'no-repeat',
                                  width: '7.5rem',
                                  height: '7.5rem',
                                  borderRadius: '0.5rem',
                                  textShadow: '0 0px 10px black',
                                  marginLeft: 'auto',
                                  // marginRight: '2rem',
                                }}
                              >
                                <i
                                  className='fas fa-heart'
                                  style={{
                                    color: 'white',
                                    outline: 'none',
                                    padding: '0.5rem',
                                  }}
                                ></i>
                                <span
                                  style={{
                                    color: 'white',
                                  }}
                                >
                                  {item.likedBy.length}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            boxSizing: 'border-box',
            width: '100vw',
            overflow: 'hidden',
          }}
        >
          <h1>Oops!</h1>
          <p>Nothing to see here...</p>
        </div>
      )}
    </>
  );
}

export default Menu;
