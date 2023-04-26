import React from 'react';

function Error({ error, dismiss }) {
  return (
    <div className='error-container'>
      {error}
      <a onClick={dismiss}>X</a>
    </div>
  );
}

export default Error;
