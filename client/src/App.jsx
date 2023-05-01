import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import Restaurants from './pages/Restaurants';
import Menus from './pages/Menus';
import Menu from './pages/Menu';
import MenuEditor from './pages/MenuEditor';
import AccountSettings from './pages/AccountSettings';
import Users from './pages/Users';
import RestaurantSettings from './pages/RestaurantSettings';

import BottomNav from './components/navigation/BottomNav';
import SideNav from './components/navigation/SideNav';
import TopNav from './components/navigation/TopNav';

import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/restaurants/:restaurantId' element={<Menu />} />
        <Route
          path='/'
          element={
            <div className='public-content-container'>
              <Outlet />
            </div>
          }
        >
          <Route path='/' element={<SignIn />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        <Route
          path='/me'
          element={
            <>
              <TopNav />
              <SideNav />
              <div className='private-content-container'>
                <Outlet />
              </div>
              <BottomNav />
            </>
          }
        >
          <Route path='/me/restaurants' element={<Restaurants />} />
          <Route path='/me/settings' element={<AccountSettings />} />
          <Route
            path='/me/restaurants/:restaurantId/menus'
            element={<Menus />}
          />
          <Route
            path='/me/restaurants/:restaurantId/menus/:menuId'
            element={<MenuEditor />}
          />
          <Route
            path='/me/restaurants/:restaurantId/settings'
            element={<RestaurantSettings />}
          />
          <Route
            path='/me/restaurants/:restaurantId/users'
            element={<Users />}
          />
        </Route>
        <Route path='*' element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
