import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import AuthContext from './contexts/AuthContext.jsx';
import RestaurantContext from './contexts/RestaurantContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContext.AuthProvider>
      <RestaurantContext.RestaurantProvider>
        <App />
      </RestaurantContext.RestaurantProvider>
    </AuthContext.AuthProvider>
  </React.StrictMode>
);
