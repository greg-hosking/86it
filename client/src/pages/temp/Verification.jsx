import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function Verification() {
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    async function verifyToken() {
      const response = await fetch('/api/auth/verification', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setLoading(false);

      if (response.ok) {
        window.location = 'http://localhost:5173/temp/signin';
      }
      // TODO: Handle error...
    }
    verifyToken();
  }, []);

  return (
    <>
      {loading ? (
        <>
          <h1>Verifying</h1>
          <p>Please wait...</p>
        </>
      ) : (
        <>
          <h1>Verification complete!</h1>
          <p>Redirecting...</p>
        </>
      )}
    </>
  );
}

export default Verification;
