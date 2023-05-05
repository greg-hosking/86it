import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext.jsx';
import RestaurantContext from '../contexts/RestaurantContext.jsx';

function MenuEditor() {
  const { authenticatedUser } = useContext(AuthContext.AuthContext);
  const { currentRestaurant } = useContext(RestaurantContext.RestaurantContext);
  const navigate = useNavigate();

  const menuId = useParams().menuId;
  const [menu, setMenu] = useState(null);

  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const [image, setImage] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
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

    async function fetchMenu() {
      const response = await fetch(
        `/api/users/me/restaurants/${currentRestaurant._id}/menus/${menuId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        return;
      }
      const menu = await response.json();
      console.log(menu);
      setMenu(menu);
    }

    fetchMenu();
  }, [authenticatedUser, currentRestaurant]);

  return (
    <div className='content-container content-container-xl'>
      {currentRestaurant && menu && (
        <>
          <h2>{menu.name}</h2>
          <div className='menu-editor-container'>
            <div
              className='categories-column'
              style={{
                height: '100%',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <h3
                style={{
                  textAlign: 'center',
                  backgroundColor: 'var(--tertiary)',
                  color: 'var(--secondary)',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                }}
              >
                Sections
              </h3>
              <ul>
                {menu.sections.map((section, index) => (
                  <li
                    key={section.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      margin: '0.5rem 0',
                      border:
                        index === selectedSectionIndex
                          ? '2px solid var(--tertiary)'
                          : '1px solid var(--text-subdued)',
                    }}
                    onClick={() => {
                      setSelectedSectionIndex(index);
                      setSelectedItemIndex(0);
                    }}
                  >
                    {/* <i
                      className='fas fa-grip-lines'
                      style={{
                        marginRight: '0.5rem',
                      }}
                    ></i> */}
                    <h4>{section.name}</h4>
                    <i
                      className='fas fa-x'
                      style={{
                        marginLeft: 'auto',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                      onClick={async () => {
                        if (
                          !confirm(
                            'Are you sure you want to delete this section?'
                          )
                        ) {
                          return;
                        }
                        // TODO: DELETE SECTION
                      }}
                    ></i>
                  </li>
                ))}
              </ul>
              <input type='submit' value='Create New Section' />
            </div>

            {menu.sections.length > 0 &&
              menu.sections[selectedSectionIndex].items.length > 0 && (
                <div
                  className='items-column'
                  style={{
                    height: '100%',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <h3
                    style={{
                      backgroundColor: 'var(--tertiary)',
                      color: 'var(--secondary)',
                      padding: '0.5rem',
                      textAlign: 'center',
                      borderRadius: '0.5rem',
                    }}
                  >
                    Items
                  </h3>
                  <ul>
                    {menu.sections[selectedSectionIndex].items.map(
                      (item, index) => (
                        <li
                          key={item.name}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            margin: '0.5rem 0',
                            border:
                              index === selectedItemIndex
                                ? '2px solid var(--tertiary)'
                                : '1px solid var(--text-subdued)',
                          }}
                          onClick={() => {
                            setSelectedItemIndex(index);
                          }}
                        >
                          <h4>
                            {/* <i
                          className='fas fa-grip-lines'
                          style={{
                            marginRight: '0.5rem',
                          }}
                        ></i> */}
                            {item.name}
                          </h4>
                          <i
                            className='fas fa-x'
                            style={{
                              marginLeft: 'auto',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                            }}
                            onClick={async () => {
                              if (
                                !confirm(
                                  'Are you sure you want to delete this item?'
                                )
                              ) {
                                return;
                              }
                              // TODO: DELETE ITEM
                            }}
                          ></i>
                        </li>
                      )
                    )}
                  </ul>
                  <input type='submit' value='Create New Item' style={{}} />
                </div>
              )}

            {menu.sections.length > 0 &&
              menu.sections[selectedSectionIndex].items.length > 0 &&
              menu.sections[selectedSectionIndex].items[selectedItemIndex] && (
                <div
                  style={{
                    border: '1px solid var(--text-subdued)',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    boxSizing: 'border-box',
                  }}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      console.log('UPLOAD!!!!!');
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <img
                      src={
                        image
                          ? image
                          : menu.sections[selectedSectionIndex].items[
                              selectedItemIndex
                            ].image
                      }
                      alt=''
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        margin: '0 auto',
                      }}
                    />
                    <div>
                      <label htmlFor='image-input'>Image</label>
                      <input
                        type='file'
                        id='image'
                        name='image'
                        onChange={handleImageChange}
                      />
                    </div>
                    <input type='submit' value='Upload' />
                  </form>
                  <form className='item-editor-column' style={{}}>
                    <label htmlFor='name'>Name</label>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      value={
                        menu.sections[selectedSectionIndex].items[
                          selectedItemIndex
                        ].name
                      }
                    />
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          width: '75%',
                        }}
                      >
                        <label htmlFor='description'>Description</label>
                        <input
                          type='text'
                          name='description'
                          id='description'
                          value={
                            menu.sections[selectedSectionIndex].items[
                              selectedItemIndex
                            ].description
                          }
                        />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <label htmlFor='price'>Price</label>
                        <input
                          type='text'
                          name='price'
                          id='price'
                          value={
                            menu.sections[selectedSectionIndex].items[
                              selectedItemIndex
                            ].price
                          }
                        />
                      </div>
                    </div>

                    <label style={{ marginTop: '1rem' }}>Ingredients</label>
                    <ul
                      style={{
                        maxHeight: '10rem',
                        overflowY: 'scroll',
                      }}
                    >
                      {menu.sections[selectedSectionIndex].items[
                        selectedItemIndex
                      ].ingredients.map((ingredient) => (
                        <li
                          key={ingredient}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: 'var(--secondary)',
                            border: '1px solid var(--text-subdued)',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            margin: '0.5rem 0',
                            marginRight: '0.5rem',
                          }}
                        >
                          <p>{ingredient}</p>
                          <i
                            className='fas fa-xs fa-times'
                            style={{
                              cursor: 'pointer',
                            }}
                          ></i>
                        </li>
                      ))}
                    </ul>

                    <div
                      style={{
                        display: 'flex',
                        marginTop: '1rem',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <input
                          type='text'
                          name='ingredient-name'
                          id='ingredient-name'
                          placeholder='Ingredient Name'
                        />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <input
                          type='submit'
                          value='Add Ingredient'
                          style={{}}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        marginTop: '1rem',
                        gap: '1rem',
                        alignContent: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignContent: 'center',
                          margin: 'auto',
                        }}
                      >
                        <input
                          type='checkbox'
                          name='unavailable'
                          id='unavailable'
                          style={{
                            width: '1rem',
                            height: '1rem',
                            borderRadius: '0.5rem',
                            marginRight: '0.5rem',
                          }}
                        />
                        <label htmlFor='unavailable'>Available</label>
                      </div>

                      <input
                        type='submit'
                        value='Save'
                        style={{
                          marginBottom: '0',
                        }}
                      />
                    </div>
                  </form>
                </div>
              )}
          </div>
        </>
      )}
    </div>
  );
}

export default MenuEditor;
