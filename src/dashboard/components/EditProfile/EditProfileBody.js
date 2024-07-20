import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';

import profilePhotoMale from '../../assets/img/male.png';
import profilePhotoFemale from '../../assets/img/female.png';

const EditProfileBody = () => {
  const { user, loading } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [file, setFile] = useState(null);

  const errorRef = useRef(null); // Reference to the error message
  const handleChangeFile = (e) => {
    const selectedFile = e.target.files[0];
    // Check if a file is selected
    if (selectedFile) {
        // Check file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMessage('Please select a png, jpg or jpeg file.');
        } else {
            setFile(selectedFile);
            setErrorMessage(null);
        }
    } else {
      setErrorMessage('Please select a file.');
    }
};
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    gender: '',
    birthdate: '',
    country: '',
    phoneNumber: '',
    email: '',
    address: '',
    facebook: '',
    linkedin: '',
    website: '',
    oldpassword: '',
    newPassword: '',
    repeatNewPassword: ''
  });

  useEffect(() => {
    if (errorMessage) {
      errorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [errorMessage]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        gender: user.gender,
        birthdate: user.birthdate,
        country: user.country,
        phoneNumber: user.phoneNumber,
        email: user.email,
        address: user.address,
        facebook: user.facebook,
        linkedin: user.linkedin,
        website: user.website,
        oldpassword: '',
        newPassword: '',
        repeatNewPassword: ''
      });
    }
  }, [user]);
  const handleSubmitFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fileUpload', file);
    formData.append('userId',user.id);
    try {
        const response = await fetch('http://localhost:5000/api/users/uploadprofilephoto', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const error = await response.text();
            setErrorMessage(error);
        }
        const data = await response.json();
        console.log('File uploaded successfully:', data);
        window.location.href = '/dashboard/profile';
        // Handle success (e.g., show success message)
    } catch (error) {
        console.error('Error uploading file:', error.message);
        // Handle error (e.g., show error message)
    }
};
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    formData.append('user_id', user.id);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:5000/api/users/profile/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      if (response.status === 201) {
        window.location.href = '/dashboard/profile';

      } else {
        setErrorMessage(result);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Error logging in');
    }
  };

  if (!user) {
    return (
      <div id="page-wrapper" style={{ marginLeft: '-6px' }}>
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  let profilePhoto;
  if (!user.photo)
    profilePhoto = user.gender === 'Male' ? profilePhotoMale : profilePhotoFemale;
  return (
    <div ref={errorRef}>
      <div id="page-wrapper" style={{ marginLeft: '-6px' }}>
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
                  {errorMessage && (
                    <div className="alert alert-danger" style={{ marginTop: '10px' }}>
                      {errorMessage}
                    </div>
                  )}
                    <div className="panel panel-default">
                      <div className="panel-body text-center">
                      {!user.photo && (
                        <img
                          src={profilePhoto}
                          style={{ width: '200px', height: '200px' }}
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
                      <form onSubmit={handleSubmitFile} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
  <input type="file"
   id="fileUpload"
   name="fileUpload"
   onChange={handleChangeFile}
    />
  <br></br>
  <button type="submit" className="btn btn-primary" disabled={!file}>
                                Submit
                            </button>
</form>
                    </div>
                   
                    <form className="form-horizontal" onSubmit={handleSubmit}>

                    <div className="panel panel-default">
                      
                      <div className="panel-heading">
                        <h4 className="panel-title">User info</h4>
                      </div>
                      <div className="panel-body">
                        <div className="form-group">
                          <label className="col-sm-2 control-label">First name</label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              value={formData.firstName}
                              onChange={handleChange}
                              name="firstName"
                              id="firstName"
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Last name</label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              value={formData.lastName}
                              onChange={handleChange}
                              name="lastName"
                              id="lastName"
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Username</label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              value={formData.username}
                              onChange={handleChange}
                              name="username"
                              id="username"
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Gender</label>
                          <div className="col-sm-10">
                            <select
                              className="form-control"
                              onChange={handleChange}
                              name="gender"
                              id="gender"
                              required
                            >
                              <option value="">Select Gender</option>
                              {formData.gender === 'Male' ? (
                                <option value="Male" selected>
                                  Male
                                </option>
                              ) : (
                                <option value="Male">Male</option>
                              )}
                              {formData.gender === 'Female' ? (
                                <option value="Female" selected>
                                  Female
                                </option>
                              ) : (
                                <option value="Female">Female</option>
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Birthdate</label>
                          <div className="col-sm-10">
                            <input
                              type="date"
                              onChange={handleChange}
                              value={formData.birthdate}
                              name="birthdate"
                              id="birthdate"
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Country</label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              onChange={handleChange}
                              value={formData.country}
                              name="country"
                              id="country"
                              className="form-control"
                              required
                            />
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
                            <input
                              type="text"
                              onChange={handleChange}
                              value={formData.phoneNumber}
                              name="phoneNumber"
                              id="phoneNumber"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Email</label>
                          <div className="col-sm-10">
                            <input
                              type="email"
                              onChange={handleChange}
                              value={formData.email}
                              name="email"
                              id="email"
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Home address</label>
                          <div className="col-sm-10">
                            <textarea
                              rows="3"
                              onChange={handleChange}
                              value={formData.address}
                              name="address"
                              id="address"
                              className="form-control"
                            ></textarea>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Facebook link :</label>
                          <div className="col-sm-10">
                            <input
                              type="url"
                              onChange={handleChange}
                              value={formData.facebook}
                              name="facebook"
                              id="facebook"
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Linkedin link :</label>
                          <div className="col-sm-10">
                            <input
                              type="url"
                              onChange={handleChange}
                              value={formData.linkedin}
                              name="linkedin"
                              id="linkedin"
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Website link :</label>
                          <div className="col-sm-10">
                            <input
                              type="url"
                              onChange={handleChange}
                              value={formData.website}
                              name="website"
                              id="website"
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <h4 className="panel-title">Security</h4>
                      </div>
                      <div className="panel-body">
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Current password</label>
                          <div className="col-sm-10">
                            <input
                              type="password"
                              onChange={handleChange}
                              name="oldpassword"
                              id="oldpassword"
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">New password</label>
                          <div className="col-sm-10">
                            <input
                              type="password"
                              onChange={handleChange}
                              name="newPassword"
                              id="newPassword"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Repeat new password</label>
                          <div className="col-sm-10">
                            <input
                              type="password"
                              onChange={handleChange}
                              name="repeatNewPassword"
                              id="repeatNewPassword"
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-sm-10 col-sm-offset-2">
                            <button type="submit" className="btn btn-primary">
                              Submit
                            </button>
                            <button type="reset" className="btn btn-default">
                              Cancel
                            </button>
                          </div>
                          <div
                            id="error-message"
                            className="col-12"
                            style={{
                              color: 'darkred',
                              fontSize: '20px',
                              marginTop: '40px',
                              marginBottom: '10px',
                              marginLeft: '250px',
                            }}
                          >
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
    </div>
  );
};

export default EditProfileBody;
