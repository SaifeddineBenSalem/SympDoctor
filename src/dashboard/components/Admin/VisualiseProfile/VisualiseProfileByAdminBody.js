import React, { useContext, useState, useEffect,useRef } from 'react';
import { UserContext } from '../../../UserContext';
import { Link, useParams,useNavigate } from 'react-router-dom';
import profilePhotoMale from '../../../assets/img/male.png';
import profilePhotoFemale from '../../../assets/img/female.png';
import bannedPhoto from '../../../assets/img/banned.png';

const VisualiseProfile = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); // Add state for error message
  const [doneMessage, setDoneMessage] = useState(''); // Add state for error message

  const { user, loading } = useContext(UserContext);
  const [user1, setUser] = useState(null);
  const { userId } = useParams();
  const errorRef = useRef(null); // Reference to the error message
  const token = localStorage.getItem('token');  // Retrieve the token from local storage
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  
  useEffect(() => {
    const fetchUserById = async (userId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/getuserbyid/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const userData = await response.json();
          console.log('Fetched user data:', userData);
          setUser(userData);
          setSelectedRole(userData.role);
          updateRoleOptions(user, userData);
        } else {
          navigate('/');
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserById(userId);
    }
  }, [userId]);
  useEffect(() => {
    if (errorMessage) {
      errorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (doneMessage) {
      errorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [errorMessage]);
  
  useEffect(() => {
    if (user && user1) {
      updateRoleOptions(user, user1);
    }
  }, [user, user1]);
  const banUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/ban/${user1.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.ok) {
        window.location.href = `/dashboard/profile/${user1.id}`;
      } else {
        const errorData = await response.json(); // Parse the response body
        setErrorMessage(errorData.message); // Set the error message in the state
      }
    } catch (error) {
      console.error('Error banning user:', error);
      setErrorMessage('An error occurred while banning the user.'); // Set a generic error message
    }
  };
  const updateRoleOptions = (currentUser, targetUser) => {
    const options = [];
    console.log(currentUser);
    console.log(targetUser);
    if (currentUser && targetUser) {
      if (currentUser.role === "SuperAdmin") {
        options.push("SuperAdmin", "Admin", "Client");
      } else if (currentUser.role === "Admin") {
        switch (targetUser.role) {
          case "SuperAdmin":
            options.push("SuperAdmin");
            break;
          case "Admin":
            options.push("Admin", "Client");
            break;
          case "Doctor":
          case "SuperDoctor":
            options.push("SuperDoctor", "Doctor", "Client");
            break;
          case "Client":
            options.push("Client", "Admin");
            break;
          default:
            break;
        }
      }
    }
    setRoleOptions(options);
  };
  
  
  const updateRole = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/updaterole/${user1.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: selectedRole }),
      });
      if (response.ok) {
        setDoneMessage("Role is updated");
      }
      if (!response.ok) {
        throw new Error('Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setErrorMessage('An error occurred while updating the role.');
    }
  };

  
  if (!user1) {
    return (
      <div id="page-wrapper" style={{ marginLeft: '-6px' }}>
        <div id="page-inner">
          <div className="row">
            <div className="col-md-12">
              <h2>SympDoctor Dashboard</h2>
              <h5>Loading user data...</h5>
              {/* You can add a spinner or loading indicator here */}
            </div>
          </div>
        </div>
      </div>
    );
  } 

  if (!user) {
    return (
      <div id="page-wrapper" style={{ marginLeft: '-6px' }}>
        <div id="page-inner">
          <div className="row">
            <div className="col-md-12">
              <h2>SympDoctor Dashboard</h2>
              <h5>Loading user data...</h5>
              {/* You can add a spinner or loading indicator here */}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    if (user.id == userId)
      window.location.href = `/dashboard/profile`;
  }
  
  

  let profilePhoto;
  if (!user1.photo)
    profilePhoto = user1.gender === 'Male' ? profilePhotoMale : profilePhotoFemale;
  return (
    <div ref={errorRef}>
    <div  id="page-wrapper" style={{ marginLeft: '-6px' }}>
      <div id="page-inner">
        <div  className="row">
          <div  className="col-md-12" style={{ marginLeft: '479px' }}>
            <h2>Profile</h2>
          </div>
        </div>
        <hr />
        <div  className="row" style={{ marginLeft: '200px' }}>
          <div className="container bootstrap snippets bootdeys">
            <div  className="row">
              <div className="col-xs-12 col-sm-9">
              {errorMessage && ( // Conditionally render the error message
                            <div className="alert alert-danger" style={{ marginTop: '10px' }}>
                              {errorMessage}
                            </div>
                          )}
               {doneMessage && ( // Conditionally render the error message
                            <div className="alert alert-success" style={{ marginTop: '10px' }}>
                              {doneMessage}
                            </div>
                          )}
                <form className="form-horizontal">
                
                  <div className="panel panel-default">
                  {user1.banned === 1 && (
                            <img
                            src={bannedPhoto} style={{ width: '130px', height: '110px',float:"left" }}
                            className="img-circle profile-avatar"
                            alt="User avatar"
                          />
                          )}
                    <div className="panel-body text-center">
                   
                      <img
                        src={profilePhoto} style={{ width: '200px', height: '200px',...(user1.banned === 1 && {
                          marginLeft:'-120px',
                        }),    
                         }}
                        className="img-circle profile-avatar"
                        alt="User avatar"
                      />
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title">User info</h4>
                    </div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Full name</label>
                        <div className="col-sm-10">
                          <p style={{ fontSize: 19, marginTop: -20 }}>{user1.first_name} {user1.last_name}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Username</label>
                        <div className="col-sm-10">
                          <p style={{ fontSize: 20, marginTop: -20 }}>{user1.username}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Gender</label>
                        <div className="col-sm-10">
                          <p style={{ fontSize: 17, marginTop: -19 }}>{user1.gender}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Birthdate</label>
                        <div className="col-sm-10">
                          <p style={{ fontSize: 20, marginTop: -20 }}>
                            {user1.Birthdate ? user1.Birthdate : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Country</label>
                        <div className="col-sm-10">
                          <p style={{ fontSize: 20, marginTop: -20 }}>
                            {user1.country ? user1.country : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Role</label>
                        <div className="col-sm-10">
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="form-control"
                            style={{ fontSize: 20, marginTop: -5 }}
                          >
                            {roleOptions.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                          <button
                            type="button"
                            onClick={updateRole}
                            className="btn btn-primary"
                            style={{ marginTop: 10 }}
                          >
                            Update Role
                          </button>
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
                            {user1.phoneNumber ? user1.phoneNumber : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Email</label>
                        <div className="col-sm-10">
                          <p style={{ fontSize: 20, marginTop: -20 }}>{user1.email}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Home address</label>
                        <div className="col-sm-10">
                          <p style={{ fontSize: 20, marginTop: -20 }}>
                            {user1.address ? user1.address : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">Doctor info</h4>
                      </div>
                      <div className="panel-body">
                        <div className="form-group">
                          <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Posted diseases</label>
                          <div className="col-sm-10">
                            <p style={{ fontSize: 19, marginTop: -20 }}>{user1.posted_disease}</p>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Accepted diseases</label>
                          <div className="col-sm-10">
                            <p style={{ fontSize: 19, marginTop: -20 }}>{user1.accepted_disease}</p>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Rejected diseases</label>
                          <div className="col-sm-10">
                            <p style={{ fontSize: 19, marginTop: -19 }}>{user1.refused_disease}</p>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Accepting diseases</label>
                          <div className="col-sm-10">
                            <p style={{ fontSize: 20, marginTop: -20 }}>{user1.accepting_disease}</p>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Refusing diseases</label>
                          <div className="col-sm-10">
                            <p style={{ fontSize: 20, marginTop: -20 }}>{user1.refusing_disease}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title">Super Doctor info</h4>
                    </div>
                    <div className="panel-body">
                      <div className="form-group">
                        <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Accepted diseases</label>
                        <div className="col-sm-10">
                          <p style={{ fontSize: 19, marginTop: -20 }}>{user1.super_accepted_diseases}</p>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label" style={{ whiteSpace: 'nowrap' }}>Refused diseases</label>
                        <div className="col-sm-10">
                          <p style={{ fontSize: 19, marginTop: -20 }}>{user1.super_refused_diseases}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title">Security</h4>
                    </div>
                    <div className="panel-body">
                      {user.role === "admin" || user.role === "SuperAdmin"  && (
                        <>
                          <div className="form-group">
                            <label className="col-sm-2 control-label">Last logged in IP </label>
                            <div className="col-sm-10">
                              <p style={{ fontSize: 20, marginTop: -20 }}>
                                {user1.ip ? user1.ip : '-'}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Last login</label>
                        <div className="col-sm-10">
                          <p style={{ fontSize: 20, marginTop: -20 }}>
                            {user1.last_login ? user1.last_login : '-'}
                          </p>
                        </div>
                      </div>
                      <div className="form-group">
                      <div className="col-sm-10 col-sm-offset-2">
                          <button type="button" className="btn btn-primary" onClick={banUser}>
                          {user1.banned === 0 && (
                            'Ban'
                          )}
                          {user1.banned === 1 && (
                            'Unban'
                          )}
                          </button>
                          
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
      </div>
    </div>
    </div>
  );
};

export default VisualiseProfile;
