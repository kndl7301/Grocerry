import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  // LocalStorage'den kullanıcı bilgisini al
  const user = JSON.parse(localStorage.getItem('user'));

  // Kullanıcı var mı ve admin mi kontrol et
  if (user && user.email === 'admin@gmail.com') {
    return children;  // Admin ise istediği sayfayı göster
  } else {
    return <Navigate to="/login" />; // Değilse login sayfasına yönlendir
  }
};

export default AdminRoute;
