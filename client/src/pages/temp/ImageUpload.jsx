import React, { useState } from 'react';

function ImageUpload() {
  const [imageUrl, setImageUrl] = useState('');

  async function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', event.target[0].files[0]);

    const response = await fetch('/api/restaurants/12345/items/123/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      alert(response.status);
    } else {
      alert('Image uploaded successfully');
    }
    const result = await response.json();

    setImageUrl(result.url);
  }

  return (
    <div>
      <form
        onSubmit={(event) => {
          handleFormSubmit(event);
        }}
      >
        <h1>Image Upload</h1>
        <input type='file' required={true} />
        <input type='submit' />
      </form>

      {imageUrl && (
        <img
          src={imageUrl}
          alt='Uploaded'
          style={{ maxWidth: '400px', maxHeight: '400px' }}
        />
      )}
    </div>
  );
}

export default ImageUpload;
