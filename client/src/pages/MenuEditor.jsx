import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext.jsx';
import RestaurantContext from '../contexts/RestaurantContext.jsx';

import Modal from '../components/Modal.jsx';

function MenuEditor() {
  const { authenticatedUser } = useContext(AuthContext.AuthContext);
  const { currentRestaurant } = useContext(RestaurantContext.RestaurantContext);
  const navigate = useNavigate();

  const menuId = useParams().menuId;
  const [menu, setMenu] = useState(null);

  const [selectedSectionIndex, setSelectedSectionIndex] = useState(-1);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemIngredients, setNewItemIngredients] = useState([]);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newItemIsAvailable, setNewItemIsAvailable] = useState(true);

  const [image, setImage] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemIngredients, setItemIngredients] = useState([]);
  const [itemIsAvailable, setItemIsAvailable] = useState(true);

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

      if (menu.sections.length > 0) {
        setSelectedSectionIndex(0);
        if (menu.sections[0].items.length > 0) {
          setSelectedItemIndex(0);
          setItemName(menu.sections[0].items[0].name);
          setItemDescription(menu.sections[0].items[0].description);
          setItemPrice(menu.sections[0].items[0].price);
          setItemIngredients(menu.sections[0].items[0].ingredients);
          setItemIsAvailable(menu.sections[0].items[0].available);
        }
      }
      setMenu(menu);
    }

    fetchMenu();
  }, [authenticatedUser, currentRestaurant]);

  return (
    <>
      <Modal
        isOpen={isNewItemModalOpen}
        toggleOpen={() => {
          setNewItemName('');
          setNewItemDescription('');
          setNewItemPrice('');
          setNewItemIngredients([]);
          setNewIngredientName('');
          setNewItemIsAvailable(true);
          setIsNewItemModalOpen(!isNewItemModalOpen);
        }}
      >
        <h2>New Item</h2>
        <div
          style={{
            borderRadius: '0.5rem',
            padding: '1rem',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          <form
            className='item-editor-column'
            onSubmit={async (e) => {
              e.preventDefault();
              const response = await fetch(
                `/api/users/me/restaurants/${currentRestaurant._id}/menus/${menuId}/sections/${menu.sections[selectedSectionIndex]._id}/items`,
                {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    name: newItemName,
                    description: newItemDescription,
                    price: Number(newItemPrice),
                    ingredients: newItemIngredients,
                    available: newItemIsAvailable,
                  }),
                }
              );

              if (!response.ok) {
                return;
              }
              const newItem = await response.json();
              setMenu({
                ...menu,
                sections: [
                  ...menu.sections.slice(0, selectedSectionIndex),
                  {
                    ...menu.sections[selectedSectionIndex],
                    items: [
                      ...menu.sections[selectedSectionIndex].items,
                      newItem,
                    ],
                  },
                  ...menu.sections.slice(selectedSectionIndex + 1),
                ],
              });

              setNewItemName('');
              setNewItemDescription('');
              setNewItemPrice('');
              setNewItemIngredients([]);
              setNewIngredientName('');
              setNewItemIsAvailable(true);
              setIsNewItemModalOpen(false);
            }}
          >
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              name='name'
              id='name'
              value={newItemName}
              onChange={(e) => {
                setNewItemName(e.target.value);
              }}
              required
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
                  value={newItemDescription}
                  onChange={(e) => {
                    setNewItemDescription(e.target.value);
                  }}
                  required
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
                  value={newItemPrice}
                  onChange={(e) => {
                    setNewItemPrice(e.target.value);
                  }}
                  required
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
              {newItemIngredients.map((ingredient) => (
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
                    onClick={() => {
                      setNewItemIngredients(
                        newItemIngredients.filter((i) => i !== ingredient)
                      );
                    }}
                  ></i>
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: '1rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <input
                  type='text'
                  name='ingredient-name'
                  id='ingredient-name'
                  placeholder='Ingredient Name'
                  value={newIngredientName}
                  onChange={(e) => {
                    setNewIngredientName(e.target.value);
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <input
                  type='button'
                  value='Add Ingredient'
                  style={{
                    backgroundColor: 'var(--tertiary)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.5rem',
                    color: 'var(--secondary)',
                    fontSize: 'inherit',
                  }}
                  onClick={() => {
                    if (newIngredientName === '') {
                      return;
                    }
                    setNewItemIngredients([
                      ...newItemIngredients,
                      newIngredientName,
                    ]);
                    setNewIngredientName('');
                  }}
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
                  checked={newItemIsAvailable}
                  onChange={(e) => {
                    setNewItemIsAvailable(e.target.checked);
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
      </Modal>

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
                        if (
                          menu.sections[index].items &&
                          menu.sections[index].items.length > 0
                        ) {
                          setSelectedItemIndex(0);
                          setItemName(menu.sections[index].items[0].name);
                          setItemDescription(
                            menu.sections[index].items[0].description
                          );
                          setItemPrice(menu.sections[index].items[0].price);
                          setItemIngredients(
                            menu.sections[index].items[0].ingredients
                          );
                          setItemIsAvailable(
                            menu.sections[index].items[0].available
                          );
                          setImage(null);
                        }
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
                          const response = await fetch(
                            `/api/users/me/restaurants/${currentRestaurant._id}/menus/${menuId}/sections/${section._id}`,
                            {
                              method: 'DELETE',
                              headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                              },
                            }
                          );

                          if (!response.ok) {
                            return;
                          }
                          setMenu({
                            ...menu,
                            sections: [
                              ...menu.sections.slice(0, index),
                              ...menu.sections.slice(index + 1),
                            ],
                          });

                          // Create a copy of the menu object
                          const newMenu = { ...menu };

                          // Remove the section at the specified index
                          newMenu.sections.splice(selectedSectionIndex, 1);

                          // Update the state with the new menu object
                          setMenu(newMenu);

                          setSelectedSectionIndex(-1);
                          setSelectedItemIndex(-1);
                        }}
                      ></i>
                    </li>
                  ))}
                </ul>
                <form
                  style={{
                    marginTop: '1rem',
                  }}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const response = await fetch(
                      `/api/users/me/restaurants/${currentRestaurant._id}/menus/${menuId}/sections`,
                      {
                        method: 'POST',
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          name: newSectionName,
                        }),
                      }
                    );

                    if (!response.ok) {
                      return;
                    }
                    const newSection = await response.json();
                    setMenu({
                      ...menu,
                      sections: [...menu.sections, newSection],
                    });

                    setNewSectionName('');
                    setSelectedSectionIndex(menu.sections.length);
                  }}
                >
                  <label htmlFor='name'>Name</label>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    value={newSectionName}
                    onChange={(e) => {
                      setNewSectionName(e.target.value);
                    }}
                  />
                  <input type='submit' value='Create New Section' />
                </form>
              </div>

              {selectedSectionIndex > -1 && (
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
                            setItemName(item.name);
                            setItemDescription(item.description);
                            setItemPrice(item.price);
                            setItemIngredients(item.ingredients);
                            setItemIsAvailable(item.available);
                            setImage(null);
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
                              const response = await fetch(
                                `/api/users/me/restaurants/${currentRestaurant._id}/menus/${menuId}/sections/${menu.sections[selectedSectionIndex]._id}/items/${item._id}`,
                                {
                                  method: 'DELETE',
                                  headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                  },
                                }
                              );
                              if (!response.ok) {
                                return;
                              }

                              // Create a copy of the menu object
                              const newMenu = { ...menu };

                              // Get the selected section
                              const selectedSection =
                                newMenu.sections[selectedSectionIndex];

                              // Remove the item at the specified index
                              selectedSection.items.splice(index, 1);

                              // Update the sections array in the new menu object
                              newMenu.sections[selectedSectionIndex] =
                                selectedSection;

                              // Update the state with the new menu object
                              setMenu(newMenu);

                              if (
                                menu.sections[selectedSectionIndex].items &&
                                menu.sections[selectedSectionIndex].items
                                  .length > 0
                              ) {
                                setSelectedItemIndex(0);
                                setItemName(
                                  menu.sections[selectedSectionIndex].items[0]
                                    .name
                                );
                                setItemDescription(
                                  menu.sections[selectedSectionIndex].items[0]
                                    .description
                                );
                                setItemPrice(
                                  menu.sections[selectedSectionIndex].items[0]
                                    .price
                                );
                                setItemIngredients(
                                  menu.sections[selectedSectionIndex].items[0]
                                    .ingredients
                                );
                                setItemIsAvailable(
                                  menu.sections[selectedSectionIndex].items[0]
                                    .available
                                );
                                setImage(null);
                              } else {
                                setSelectedItemIndex(-1);
                              }
                            }}
                          ></i>
                        </li>
                      )
                    )}
                  </ul>

                  <input
                    type='submit'
                    value='Create New Item'
                    style={{
                      marginTop: '0.5rem',
                    }}
                    onClick={() => {
                      setIsNewItemModalOpen(true);
                    }}
                  />
                </div>
              )}

              {selectedSectionIndex > -1 &&
                menu.sections[selectedSectionIndex].items &&
                menu.sections[selectedSectionIndex].items.length > 0 &&
                menu.sections[selectedSectionIndex].items[
                  selectedItemIndex
                ] && (
                  <div
                    style={{
                      border: '1px solid var(--text-subdued)',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData();
                        formData.append('image', e.target.image.files[0]);
                        const response = await fetch(
                          `/api/users/me/restaurants/${currentRestaurant._id}/menus/${menuId}/sections/${menu.sections[selectedSectionIndex]._id}/items/${menu.sections[selectedSectionIndex].items[selectedItemIndex]._id}/image`,
                          {
                            method: 'PUT',
                            body: formData,
                          }
                        );
                        console.log(response);
                        if (!response.ok) {
                          alert('Image upload failed');
                          return;
                        }
                        alert('Image uploaded successfully');
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
                    <form
                      className='item-editor-column'
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const response = await fetch(
                          `/api/users/me/restaurants/${currentRestaurant._id}/menus/${menuId}/sections/${menu.sections[selectedSectionIndex]._id}/items/${menu.sections[selectedSectionIndex].items[selectedItemIndex]._id}`,
                          {
                            method: 'PUT',
                            headers: {
                              Accept: 'application/json',
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              name: itemName,
                              description: itemDescription,
                              price: Number(itemPrice),
                              ingredients: itemIngredients,
                              available: itemIsAvailable,
                            }),
                          }
                        );

                        if (!response.ok) {
                          return;
                        }
                        const newItem = await response.json();
                        setMenu({
                          ...menu,
                          sections: [
                            ...menu.sections.slice(0, selectedSectionIndex),
                            {
                              ...menu.sections[selectedSectionIndex],
                              items: [
                                ...menu.sections[
                                  selectedSectionIndex
                                ].items.slice(0, selectedItemIndex),
                                newItem,
                                ...menu.sections[
                                  selectedSectionIndex
                                ].items.slice(selectedItemIndex + 1),
                              ],
                            },
                            ...menu.sections.slice(selectedSectionIndex + 1),
                          ],
                        });
                      }}
                    >
                      <label htmlFor='name'>Name</label>
                      <input
                        type='text'
                        name='name'
                        id='name'
                        value={itemName}
                        onChange={(e) => {
                          setItemName(e.target.value);
                        }}
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
                            value={itemDescription}
                            onChange={(e) => {
                              setItemDescription(e.target.value);
                            }}
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
                            value={itemPrice}
                            onChange={(e) => {
                              setItemPrice(e.target.value);
                            }}
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
                        {itemIngredients.map((ingredient) => (
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
                            }}
                          >
                            <p>{ingredient}</p>
                            <i
                              className='fas fa-xs fa-times'
                              style={{
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                setItemIngredients(
                                  itemIngredients.filter(
                                    (i) => i !== ingredient
                                  )
                                );
                              }}
                            ></i>
                          </li>
                        ))}
                      </ul>

                      <div
                        style={{
                          marginTop: '1rem',
                        }}
                      >
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <input
                            type='text'
                            name='ingredient-name'
                            id='ingredient-name'
                            placeholder='Ingredient Name'
                            value={newIngredientName}
                            onChange={(e) => {
                              setNewIngredientName(e.target.value);
                            }}
                          />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <input
                            type='button'
                            value='Add Ingredient'
                            style={{
                              backgroundColor: 'var(--tertiary)',
                              border: 'none',
                              borderRadius: '0.5rem',
                              padding: '0.5rem',
                              color: 'var(--secondary)',
                              fontSize: 'inherit',
                            }}
                            onClick={() => {
                              if (newIngredientName === '') {
                                return;
                              }
                              setItemIngredients([
                                ...itemIngredients,
                                newIngredientName,
                              ]);
                              setNewIngredientName('');
                            }}
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
                            name='available'
                            id='available'
                            style={{
                              width: '1rem',
                              height: '1rem',
                              borderRadius: '0.5rem',
                              marginRight: '0.5rem',
                            }}
                            checked={itemIsAvailable}
                            onChange={(e) => {
                              setItemIsAvailable(e.target.checked);
                            }}
                          />
                          <label htmlFor='available'>Available</label>
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
    </>
  );
}

export default MenuEditor;
