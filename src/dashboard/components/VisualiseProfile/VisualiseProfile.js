import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';
import profilePhotoMale from '../../assets/img/male.png';
import profilePhotoFemale from '../../assets/img/female.png';
import facebookLogo from '../../assets/img/logos/facebook.png';
import linkedinLogo from '../../assets/img/logos/linkedin.jpg';
import websiteLogo from '../../assets/img/logos/website.png';

const VisualiseProfile = () => {
  const { user, loading } = useContext(UserContext);
  

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
  let profilePhoto;
  if (!user.photo)
    profilePhoto = user.gender === 'Male' ? profilePhotoMale : profilePhotoFemale;
  return (
    <div id="page-wrapper" style={{ marginLeft: '-6px' }} >
      <div id="page-inner">
        <div className="row">
          <div className="col-md-12" style={{ marginLeft: '479px' }}>
          <h2>Profile</h2>
          </div>
        </div>
        <hr />
        <div className="row" style={{ marginLeft: '200px' }}>
        <div className="container bootstrap snippets bootdeys">
      <div className="row">
        <div className="col-xs-12 col-sm-9">
            <div className="panel panel-default">
              <div className="panel-body text-center">
              {!user.photo && (
                <img
                  src={profilePhoto} style={{ width: '200px',height:'200px'  }}
                  className="img-circle profile-avatar"
                  alt="User avatar"
                />
              )}
                {user.photo && (
                            <img
                              src={`http://localhost:5000/uploads/profilephoto/${user.photo}`}
                              style={{ width: '200px', height: '200px' }}
                              className="img-circle profile-avatar"
                              alt="User avatar"
                            />
                          )}

              </div>
             
            </div>
            <form className="form-horizontal">

            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">User info</h4>
              </div>
              <div className="panel-body">
                <div className="form-group">
                  <label className="col-sm-2 control-label">Full name</label>
                  <div className="col-sm-10">
                    <p style={{ fontSize:19,marginTop:-20 }}>{user.first_name} {user.last_name}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Username</label>
                  <div className="col-sm-10">
                  <p style={{ fontSize:20,marginTop:-20 }}>{user.username}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Gender</label>
                  <div className="col-sm-10">
                    <p style={{ fontSize:17,marginTop:-19 }}>{user.gender}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Birthdate</label>
                  <div className="col-sm-10">
                  <p style={{ fontSize: 20, marginTop: -20 }}>
  {user.birthdate ? user.birthdate : '-'}
    </p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Country</label>
                  <div className="col-sm-10">
                  <p style={{ fontSize: 20, marginTop: -20 }}>
  {user.country ? user.country : '-'}
    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">Contact info</h4>
              </div>
              <div className="panel-body">
                <div className="form-group">
                  <label className="col-sm-2 control-label">Phone number</label>
                  <div className="col-sm-10">
                  <p style={{ fontSize: 20, marginTop: -20 }}>
  {user.phoneNumber ? user.phoneNumber : '-'}
    </p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Email</label>
                  <div className="col-sm-10">
                  <p style={{ fontSize:20,marginTop:-20 }}>{user.email}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Home address</label>
                  <div className="col-sm-10">
                  <p style={{ fontSize: 20, marginTop: -20 }}>
  {user.address ? user.address : '-'}
    </p>
                      </div>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
                  {user.facebook && (
                    <div style={{ marginLeft: '40px' }}>
                      <Link to={user.facebook}>
                        <img
                          src={facebookLogo}
                          style={{ width: '125px', height: '125px' }}
                          className="img-circle profile-avatar"
                          alt="User avatar"
                        />
                      </Link>
                    </div>
                  )}
                  {user.linkedin && (
                    <div  style={{ marginLeft: '80px' }}>
                      <Link to={user.linkedin}> 
                        <img
                          src={linkedinLogo}
                          style={{ width: '200px', height: '200px' }}
                          className="img-circle profile-avatar"
                          alt="User avatar"
                        />
                      </Link>
                    </div>
                  )}
                   {user.website && (
                    <div style={{ marginLeft: '80px' }}>
                      <Link to={user.website}>
                        <img
                          src={websiteLogo}
                          style={{ width: '125px', height: '125px' }}
                          className="img-circle profile-avatar"
                          alt="User avatar"
                        />
                      </Link>
                    </div>
                  )}
                </div>



                
              
                
              </div>
            </div>
            {(user.role === "Doctor" || user.role === "SuperDoctor") && (
  <React.Fragment>
            <div className="panel panel-default">
  <div className="panel-heading">
    <h4 className="panel-title">Doctor info</h4>
  </div>
  <div className="panel-body">
    <div className="form-group">
      <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Posted diseases</label>
      <div className="col-sm-10">
        <p style={{ fontSize: 19, marginTop: -20 }}>{user.posted_disease}</p>
      </div>
    </div>
    <div className="form-group">
      <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Accepted diseases</label>
      <div className="col-sm-10">
        <p style={{ fontSize: 19, marginTop: -20 }}>{user.accepted_disease}</p>
      </div>
    </div>
    <div className="form-group">
      <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Rejected diseases</label>
      <div className="col-sm-10">
        <p style={{ fontSize: 19, marginTop: -19 }}>{user.refused_disease}</p>
      </div>
    </div>
    <div className="form-group">
      <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Accepting diseases</label>
      <div className="col-sm-10">
        <p style={{ fontSize: 20, marginTop: -20 }}>{user.accepting_disease}</p>
      </div>
    </div>
    <div className="form-group">
      <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Refusing diseases</label>
      <div className="col-sm-10">
        <p style={{ fontSize: 20, marginTop: -20 }}>{user.refusing_disease}</p>
      </div>
    </div>
  </div>
</div>
</React.Fragment>
            )}
{( user.role === "SuperDoctor") && (
  <React.Fragment>
<div className="panel panel-default">
  <div className="panel-heading">
    <h4 className="panel-title">Super Doctor info</h4>
  </div>
  <div className="panel-body">
    <div className="form-group">
      <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Accepted diseases</label>
      <div className="col-sm-10">
        <p style={{ fontSize: 19, marginTop: -20 }}>{user.super_accepted_diseases}</p>
      </div>
    </div>
    <div className="form-group">
      <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Refused diseases</label>
      <div className="col-sm-10">
        <p style={{ fontSize: 19, marginTop: -20 }}>{user.super_refused_diseases}</p>
      </div>
    </div>
   
  </div>
</div>
</React.Fragment>
)}



            <div className="panel panel-default">
              <div className="panel-heading">
                <h4 className="panel-title">Security</h4>
              </div>
              <div className="panel-body">
              {user.role === "admin" && (
    <>
                <div className="form-group">
                  <label className="col-sm-2 control-label">Last logged in IP </label>
                  <div className="col-sm-10">
                  <p style={{ fontSize: 20, marginTop: -20 }}>
  {user.address ? user.address : '-'}
    </p>
                      </div>
                </div>
                </>
  )}
                 <div className="form-group">
                  <label className="col-sm-2 control-label">Last login</label>
                  <div className="col-sm-10">
                  <p style={{ fontSize: 20, marginTop: -20 }}>
                    {user.last_login ? user.last_login : '-'}
                  </p>
                      </div>
                </div>
                <div className="form-group">
                  <label className="col-sm-2 control-label">IP</label>
                  <div className="col-sm-10">
                  <p style={{ fontSize: 20, marginTop: -20 }}>
                    {user.ip ? user.ip : '-'}
                  </p>
                      </div>
                </div>
  
                <div className="form-group">
                  <div className="col-sm-10 col-sm-offset-2">
                    <Link type="submit" className="btn btn-primary"  to="/dashboard/profile/edit">Edit profile</Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
        </div>
        <hr />
        {/* Add more rows and columns as needed */}
      </div>
    </div>
  );
};

export default VisualiseProfile;
