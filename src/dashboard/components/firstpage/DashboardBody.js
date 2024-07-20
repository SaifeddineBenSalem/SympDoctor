import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';

import profilePhotoMale from '../../assets/img/male.png';
import profilePhotoFemale from '../../assets/img/female.png';

const DashboardBody = () => {
  const { user, loading } = useContext(UserContext);
  
  // Conditional rendering based on user existence
  if (!user) {
    return (
      <div id="page-wrapper" style={{ marginLeft: '-6px' }} >
        <div id="page-inner">
          <div className="row">
            <div className="col-md-12">
              <h2>SympDoctor Dashboard </h2>
              <h5>Loading user data...</h5>
              {/* You can add a spinner or loading indicator here */}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div id="page-wrapper" style={{ marginLeft: '-6px' }} >
      <div id="page-inner">
        <div className="row">
          <div className="col-md-12">
          <h2>SympDoctor Dashboard</h2>
          <h5>Welcome   { user.first_name} { user.last_name}, Love to see you back.</h5>

          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-3 col-sm-6 col-xs-6">
            <div className="panel panel-back noti-box">
            <Link to="/">
              <span className="icon-box bg-color-red set-icon">
              <i class="fa fa-plus"></i>
              </span> 
              </Link>
              <div className="text-box">
              <Link className="main-text" to="/dashboard/add">Add illness</Link>
                <p className="text-muted">‎ </p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-xs-6" >
            <div className="panel panel-back noti-box" style={{ height:127.5 }}>
            <Link  to="/">
              <span className="icon-box bg-color-green set-icon">
              <i class="fa fa-user"></i>
              </span>
              </Link>
              <div className="text-box">
              <Link  className="main-text"  to="/dashboard/profile">Profile </Link>
                <p className="text-muted">‎</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-xs-6">
            <div className="panel panel-back noti-box">
              <span className="icon-box bg-color-blue set-icon">
                <i className="fa fa-bell-o"></i>
              </span>
              <div className="text-box">
              <Link  className="main-text"  to="/dashboard/charts">Charts </Link>
                <p className="text-muted">‎</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-xs-6">
            <div className="panel panel-back noti-box">
              <span className="icon-box bg-color-brown set-icon">
                <i className="fa fa-rocket"></i>
              </span>
              <div className="text-box">
              <Link  className="main-text"  to="/dashboard/apply/view">Application</Link>
                <p className="text-muted">‎</p>
              </div>
            </div>
          </div>
        </div>    
        <hr />
        {(user.role === "Doctor" || user.role === "SuperDoctor") && (
  <React.Fragment>
    <div className="row">
      <div className="col-md-3 col-sm-6 col-xs-6">
        <div className="panel panel-back noti-box">
          <Link to="/">
            <span className="icon-box bg-color-red set-icon">
              <i class="fa fa-plus"></i>
            </span> 
          </Link>
          <div className="text-box">
            <Link className="main-text" to="/dashboard/doctors/add">Add disease</Link>
            <p className="text-muted">‎ </p>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6 col-xs-6" >
        <div className="panel panel-back noti-box" style={{ height:127.5 }}>
          <Link  to="/">
            <span className="icon-box bg-color-green set-icon">
              <i class="fa fa-user"></i>
            </span>
          </Link>
          <div className="text-box">
            <Link  className="main-text"  to="/dashboard/doctors/pending">Pending requests </Link>
            <p className="text-muted">‎</p>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6 col-xs-6">
        <div className="panel panel-back noti-box">
          <span className="icon-box bg-color-blue set-icon">
            <i className="fa fa-bell-o"></i>
          </span>
          <div className="text-box">
            <Link  className="main-text"  to="/dashboard/doctors/charts">Charts </Link>
            <p className="text-muted">‎</p>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6 col-xs-6">
        <div className="panel panel-back noti-box">
          <span className="icon-box bg-color-brown set-icon">
            <i className="fa fa-rocket"></i>
          </span>
          <div className="text-box">
          <Link  className="main-text"  to="/dashboard/doctors/diseases">Diseases</Link>
            <p className="text-muted">‎</p>
          </div>
        </div>
      </div>
    </div>
    <hr />
  </React.Fragment>
)}
 {user.role === "Admin" ||  user.role === "SuperAdmin" && (
  <React.Fragment>
    <div className="row">
      <div className="col-md-3 col-sm-6 col-xs-6">
        <div className="panel panel-back noti-box">
          <Link to="/dashboard/admin/users">
            <span style={{backgroundColor:'lightgreen'}} className="icon-box set-icon">
            <i  class="fa fa-users"></i>
            </span> 
          </Link>
          <div className="text-box">
            <Link className="main-text" to="/dashboard/admin/users">Users list</Link>
            <p className="text-muted">‎ </p>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6 col-xs-6" >
        <div className="panel panel-back noti-box" style={{ height:127.5 }}>
          <Link  to="/">
            <span className="icon-box bg-color-green set-icon">
              <i class="fa fa-user"></i>
            </span>
          </Link>
          <div className="text-box">
            <Link  className="main-text"  to="/dashboard/feedback/list">Feedbacks </Link>
            <p className="text-muted">‎</p>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6 col-xs-6">
        <div className="panel panel-back noti-box">
          <span className="icon-box bg-color-blue set-icon">
            <i className="fa fa-bell-o"></i>
          </span>
          <div className="text-box">
            <Link  className="main-text"  to="/dashboard/charts">Charts </Link>
            <p className="text-muted">‎</p>
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6 col-xs-6">
        <div className="panel panel-back noti-box">
          <span className="icon-box bg-color-brown set-icon">
            <i className="fa fa-rocket"></i>
          </span>
          <div className="text-box">
            <p className="main-text">3 Orders</p>
            <p className="text-muted">‎</p>
          </div>
        </div>
      </div>
    </div>
    <hr />
  </React.Fragment>
)}
        {/* Add more rows and columns as needed */}
      </div>
    </div>
  );
};

export default DashboardBody;
