import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Restaurants from './pages/Restaurants';
import Menus from './pages/Menus';
import Settings from './pages/Settings';
import Users from './pages/Users';

import Sidenav from './components/Sidenav';
import Topnav from './components/Topnav';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <div className='public-content-container'>
              <Outlet />
            </div>
          }
        >
          <Route path='/' element={<SignIn />} />
          <Route path='sign-in' element={<SignIn />} />
          <Route path='sign-up' element={<SignUp />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='reset-password' element={<ResetPassword />} />
        </Route>
        <Route
          path='/me'
          element={
            <>
              <Topnav />
              <Sidenav />
              <div className='private-content-container'>
                <Outlet />
              </div>
            </>
          }
        >
          <Route path='/me/restaurants' element={<Restaurants />} />
          <Route
            path='/me/restaurants/:restaurantId/menus'
            element={<Menus />}
          />
          <Route
            path='/me/restaurants/:restaurantId/users'
            element={<Users />}
          />
          <Route path='/me/settings' element={<Settings />} />
        </Route>
        <Route path='*' element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
