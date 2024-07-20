import React from 'react';
import Navbar from './Components/Commun/Navbar';
import Footer from './Components/Commun/Footer';

import './css/bootstrap-icons.css';
import './css/bootstrap.min.css';
import './css/owl.theme.default.min.css';
import './css/tooplate-gotto-job.css';
import LoginForm1 from './Components/Login/LoginForm';

const Login = () => {
  return (
    <div>
    <Navbar />
    <LoginForm1 />
    <Footer />
    </div>
  );
};

export default Login;
