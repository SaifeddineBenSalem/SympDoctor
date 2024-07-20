import React from 'react';
import Navbar from './Components/Commun/Navbar';
import HeroSection from './Components/Homepage/HeroSection';
import Categories from './Components/Homepage/CategoriesSection';

import AboutSection from './Components/Homepage/AboutSection';
import JobSection from './Components/Homepage/JobSection';
import IntroductionSection from './Components/Homepage/IntroductionSection';
import RecentJobsSection from './Components/Homepage/JobRecent';
import ReviewsSection from './Components/Homepage/HappyCustomers';
import CtaSection from './Components/Homepage/CtaSection';
import Footer from './Components/Commun/Footer';


import './css/bootstrap-icons.css';
import './css/bootstrap.min.css';
import './css/owl.theme.default.min.css';
import './css/tooplate-gotto-job.css';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <IntroductionSection />
      <Categories />
      <JobSection />
      <ReviewsSection/>
      <Footer/>
      
    </div>
  );
};

export default HomePage;