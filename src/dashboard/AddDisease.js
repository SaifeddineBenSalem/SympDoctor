import React from 'react';
import Navbar from './components/commun/Navbar';
import Footer from './components/commun/Footer';
import Sidebar from './components/commun/Sidebar1';
import AddDiseaseBody from './components/AddDisease/AddDiseaseBody';
import { UserProvider } from './UserContext';
import './assets/css/bootstrap.css';
import './assets/css/custom.css';
import './assets/css/font-awesome.css';
import './assets/css/bootstrap.min.css.map';

const AddIllness = () => {
  return (
    <UserProvider>
      <div id="wrapper">
        <Navbar />
        <Sidebar />
        <div id="page-wrapper">
          <AddDiseaseBody/>
          <Footer />
        </div>
      </div>
    </UserProvider>
  );
};

export default AddIllness;
