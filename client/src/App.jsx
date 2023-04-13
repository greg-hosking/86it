import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SignUp from './pages/temp/SignUp';
import SignIn from './pages/temp/SignIn';
import Verification from './pages/temp/Verification';
import ForgotPassword from './pages/temp/ForgotPassword';
import ResetPassword from './pages/temp/ResetPassword';
import ImageUpload from './pages/temp/ImageUpload';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignUp />} />
        <Route path='/temp/sign-up' element={<SignUp />} />
        <Route path='/temp/sign-in' element={<SignIn />} />
        <Route path='/temp/verification' element={<Verification />} />
        <Route path='/temp/forgot-password' element={<ForgotPassword />} />
        <Route path='/temp/reset-password' element={<ResetPassword />} />
        <Route path='/temp/image-upload' element={<ImageUpload />} />
        <Route path='*' element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
