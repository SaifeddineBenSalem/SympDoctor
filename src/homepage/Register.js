import React from 'react';
import Navbar from './Components/Commun/Navbar';
import Footer from './Components/Commun/Footer';
import RegisterForm1 from './Components/Register/RegisterForm';

import './css/bootstrap-icons.css';
import './css/bootstrap.min.css';
import './css/owl.theme.default.min.css';
import './css/tooplate-gotto-job.css';

const Login = () => {
  return (
    <div>
    <Navbar />
    <RegisterForm1 />
    <Footer />
    </div>
  );
};

export default Login;
