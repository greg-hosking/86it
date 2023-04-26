import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Topnav() {
  return (
    <nav id='topnav'>
      <Link to='/me/restaurants' id='nav-brand'>
        <h1>86it</h1>
      </Link>
    </nav>
  );
}

export default Topnav;
