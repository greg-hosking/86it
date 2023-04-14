import React, { useEffect, useState, useRef } from 'react';

function UserListItem({ user }) {
  const shouldFetch = useRef(true);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      shouldFetch.current = false;

      const response = await fetch(`/api/users/${user.userId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setUserData({ ...data, role: user.role });
      setLoading(false);
    }
    if (shouldFetch.current) {
      fetchData();
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <li>Loading...</li>
      ) : (
        <li>
          {userData.firstName} {userData.lastName} {userData.email} (
          {userData.role})
        </li>
      )}
    </>
  );
}

export default UserListItem;
