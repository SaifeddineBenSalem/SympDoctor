import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';

import profilePhotoMale from '../../assets/img/male.png';
import profilePhotoFemale from '../../assets/img/female.png';

const Sidebar = () => {
  const { user, loading } = useContext(UserContext);
  if (!user) {
    return (
      <div id="page-wrapper" style={{ marginLeft: '-6px' }} >
        <div id="page-inner">
          <div className="row">
            <div className="col-md-12">
              <h5>Loading user data...</h5>
              {/* You can add a spinner or loading indicator here */}
            </div>
          </div>
        </div>
      </div>
    );
  }
  let profilePhoto = null
  if (!user.photo)
 profilePhoto = user.gender === 'Male' ? profilePhotoMale : profilePhotoFemale;

  return (
    <nav className="navbar-default navbar-side" role="navigation">
      <div className="sidebar-collapse">
        <ul className="nav" id="main-menu">
          <li >
          {!user.photo && (
            <img style={{marginLeft:30}} src={profilePhoto} className="user-image img-responsive" alt="User" />
              )}
                {user.photo && (
                      <img style={{marginLeft:33}} src={`http://localhost:5000/uploads/profilephoto/${user.photo}`} className="user-image img-responsive" alt="User" />
                  )}

          </li>
          <li>
  <Link style={{width: 260,height:120, display: 'flex', alignItems: 'center'}} className="active-menu" to="/dashboard">
    <i className="fa fa-dashboard fa-3x"></i>
    <div style={{marginLeft: '10px'}}>Dashboard</div>
  </Link>
</li>

          {(user.role === "Client") && (
            <React.Fragment>
          <li>
          <Link style={{width: 260,height:120, display: 'flex', alignItems: 'center'}} to="/dashboard/apply"><i className="fa fa-bar-chart-o fa-3x"></i>
          You're a doctor? Apply Here
          </Link>
          </li>
          </React.Fragment>
          )}

          
          <li>
          <Link style={{width: 260,height:120, display: 'flex', alignItems: 'center'}} to="/dashboard/feedback/post"> <i className="fa fa-edit fa-3x"></i> Post a feedback
          </Link>
          </li>
         
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
