import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import '../assets/css/global.css';  

const MainPage = () => {
  return (
    <div className="main-container">
      <Header />
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
