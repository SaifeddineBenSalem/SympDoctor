import React from 'react';
import Navbar from './Components/Commun/Navbar';
import Footer from './Components/Commun/Footer';

import './css/bootstrap-icons.css';
import './css/bootstrap.min.css';
import './css/owl.theme.default.min.css';
import './css/tooplate-gotto-job.css';
import ResetPasswordBody from './Components/ResetPassword/ResetPasswordBody';

const ResetPassword = () => {
  return (
    <div>
    <Navbar />
    <ResetPasswordBody />
    <Footer />
    </div>
  );
};

export default ResetPassword;
