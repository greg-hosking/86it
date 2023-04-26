import React from 'react';

function Error({ error, dismiss }) {
  return (
    <div className='error-container'>
      <p
        style={{
          textAlign: dismiss ? 'left' : 'center',
          width: !dismiss && '100%',
        }}
      >
        {error}
      </p>
      {dismiss && <a onClick={dismiss}>X</a>}
    </div>
  );
}

export default Error;
