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
    repeatNewPassword: '',
    securityQuestion: '',
    securityResponse:''
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
        securityQuestion:'',
        securityResponse: '' ,
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
                            <select onChange={handleChange} value={formData.country} id="country" name="country" className="form-select form-select-lg" aria-label="Select Country" style={{height:'34px'}} required>
                <option value="">Select Country</option>
                <option value="Afghanistan">Afghanistan</option>
                <option value="Åland Islands">Åland Islands</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="American Samoa">American Samoa</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Anguilla">Anguilla</option>
                <option value="Antarctica">Antarctica</option>
                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                <option value="Argentina">Argentina</option>
                <option value="Armenia">Armenia</option>
                <option value="Aruba">Aruba</option>
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Azerbaijan">Azerbaijan</option>
                <option value="Bahamas">Bahamas</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Barbados">Barbados</option>
                <option value="Belarus">Belarus</option>
                <option value="Belgium">Belgium</option>
                <option value="Belize">Belize</option>
                <option value="Benin">Benin</option>
                <option value="Bermuda">Bermuda</option>
                <option value="Bhutan">Bhutan</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                <option value="Botswana">Botswana</option>
                <option value="Bouvet Island">Bouvet Island</option>
                <option value="Brazil">Brazil</option>
                <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                <option value="Brunei Darussalam">Brunei Darussalam</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Canada">Canada</option>
                <option value="Cape Verde">Cape Verde</option>
                <option value="Cayman Islands">Cayman Islands</option>
                <option value="Central African Republic">Central African Republic</option>
                <option value="Chad">Chad</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Christmas Island">Christmas Island</option>
                <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                <option value="Colombia">Colombia</option>
                <option value="Comoros">Comoros</option>
                <option value="Congo">Congo</option>
                <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                <option value="Cook Islands">Cook Islands</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Cote D'ivoire">Cote D'ivoire</option>
                <option value="Croatia">Croatia</option>
                <option value="Cuba">Cuba</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Czech Republic">Czech Republic</option>
                <option value="Denmark">Denmark</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Estonia">Estonia</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                <option value="Faroe Islands">Faroe Islands</option>
                <option value="Fiji">Fiji</option>
                <option value="Finland">Finland</option>
                <option value="France">France</option>
                <option value="French Guiana">French Guiana</option>
                <option value="French Polynesia">French Polynesia</option>
                <option value="French Southern Territories">French Southern Territories</option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Germany">Germany</option>
                <option value="Ghana">Ghana</option>
                <option value="Gibraltar">Gibraltar</option>
                <option value="Greece">Greece</option>
                <option value="Greenland">Greenland</option>
                <option value="Grenada">Grenada</option>
                <option value="Guadeloupe">Guadeloupe</option>
                <option value="Guam">Guam</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guernsey">Guernsey</option>
                <option value="Guinea">Guinea</option>
                <option value="Guinea-bissau">Guinea-bissau</option>
                <option value="Guyana">Guyana</option>
                <option value="Haiti">Haiti</option>
                <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                <option value="Honduras">Honduras</option>
                <option value="Hong Kong">Hong Kong</option>
                <option value="Hungary">Hungary</option>
                <option value="Iceland">Iceland</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                <option value="Iraq">Iraq</option>
                <option value="Ireland">Ireland</option>
                <option value="Isle of Man">Isle of Man</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japan">Japan</option>
                <option value="Jersey">Jersey</option>
                <option value="Jordan">Jordan</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Kenya">Kenya</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                <option value="Korea, Republic of">Korea, Republic of</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Kyrgyzstan">Kyrgyzstan</option>
                <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                <option value="Latvia">Latvia</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lithuania">Lithuania</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Macao">Macao</option>
                <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malawi">Malawi</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Maldives">Maldives</option>
                <option value="Mali">Mali</option>
                <option value="Malta">Malta</option>
                <option value="Marshall Islands">Marshall Islands</option>
                <option value="Martinique">Martinique</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Mayotte">Mayotte</option>
                <option value="Mexico">Mexico</option>
                <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                <option value="Moldova, Republic of">Moldova, Republic of</option>
                <option value="Monaco">Monaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montenegro">Montenegro</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Namibia">Namibia</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Netherlands Antilles">Netherlands Antilles</option>
                <option value="New Caledonia">New Caledonia</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Niue">Niue</option>
                <option value="Norfolk Island">Norfolk Island</option>
                <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                <option value="Norway">Norway</option>
                <option value="Oman">Oman</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Palau">Palau</option>
                <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                <option value="Panama">Panama</option>
                <option value="Papua New Guinea">Papua New Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Philippines">Philippines</option>
                <option value="Pitcairn">Pitcairn</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Puerto Rico">Puerto Rico</option>
                <option value="Qatar">Qatar</option>
                <option value="Reunion">Reunion</option>
                <option value="Romania">Romania</option>
                <option value="Russian Federation">Russian Federation</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Saint Helena">Saint Helena</option>
                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                <option value="Saint Lucia">Saint Lucia</option>
                <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                <option value="Samoa">Samoa</option>
                <option value="San Marino">San Marino</option>
                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Senegal">Senegal</option>
                <option value="Serbia">Serbia</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra Leone">Sierra Leone</option>
                <option value="Singapore">Singapore</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Solomon Islands">Solomon Islands</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                <option value="Spain">Spain</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Sudan">Sudan</option>
                <option value="Suriname">Suriname</option>
                <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                <option value="Swaziland">Swaziland</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                <option value="Taiwan">Taiwan</option>
                <option value="Tajikistan">Tajikistan</option>
                <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                <option value="Thailand">Thailand</option>
                <option value="Timor-leste">Timor-leste</option>
                <option value="Togo">Togo</option>
                <option value="Tokelau">Tokelau</option>
                <option value="Tonga">Tonga</option>
                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Turkey">Turkey</option>
                <option value="Turkmenistan">Turkmenistan</option>
                <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="Uganda">Uganda</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Viet Nam">Viet Nam</option>
                <option value="Virgin Islands, British">Virgin Islands, British</option>
                <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                <option value="Wallis and Futuna">Wallis and Futuna</option>
                <option value="Western Sahara">Western Sahara</option>
                <option value="Yemen">Yemen</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
              </select>
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
                          <label className="col-sm-2 control-label">Security question</label>
                          <div className="col-sm-10">
                          <select onChange={handleChange} id="securityQuestion" name="securityQuestion" className="form-select form-select-lg" aria-label="Select Security Question" style={{height:'34px'}}>
                              <option value="">Select security question</option>
                              <option value="What is the name of your first pet?">What is the name of your first pet?</option>
                              <option value="What was your childhood nickname?">What was your childhood nickname?</option>
                              <option value="What is the name of the street you grew up on?">What is the name of the street you grew up on?</option>
                              <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                              <option value="What was your first car?">What was your first car?</option>
                              <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                              <option value="What is your favorite food?">What is your favorite food?</option>
                              <option value="In what city were you born?">In what city were you born?</option>
                              <option value="What is your favorite movie?">What is your favorite movie?</option>
                              <option value="What is your best friend's name?">What is your best friend's name?</option>
                          </select>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="col-sm-2 control-label">Security question response</label>
                          <div className="col-sm-10">
                          <input onChange={handleChange} type="text" name="securityResponse" id="securityResponse" className="form-control form-control-lg" placeholder="Response to security question" />
                          </div>
                        </div>
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
