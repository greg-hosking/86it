import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SignUp from './pages/temp/SignUp';
import SignIn from './pages/temp/SignIn';
import Verification from './pages/temp/Verification';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignUp />} />
        <Route path='/temp/signup' element={<SignUp />} />
        <Route path='/temp/signin' element={<SignIn />} />
        <Route path='/temp/verification' element={<Verification />} />
        <Route path='*' element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
