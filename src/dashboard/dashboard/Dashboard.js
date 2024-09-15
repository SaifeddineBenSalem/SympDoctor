import React, { useContext } from 'react';
import Navbar from './components/commun/Navbar';
import Footer from './components/commun/Footer';
import Sidebar from './components/commun/Sidebar1';
import DashboardBody from './components/firstpage/DashboardBody';
import { UserProvider } from './UserContext';
import './assets/css/bootstrap.css';
import './assets/css/custom.css';
import './assets/css/font-awesome.css';
import './assets/css/bootstrap.min.css.map';
import { UserContext } from './UserContext';

const Dashboard = () => {
  //alert(user);
  return (
    <UserProvider>
      <div id="wrapper">
        <Navbar />
        <Sidebar />
        <div id="page-wrapper">
          <DashboardBody />
          <Footer />
        </div>
      </div>
    </UserProvider>
  );
};

export default Dashboard;
