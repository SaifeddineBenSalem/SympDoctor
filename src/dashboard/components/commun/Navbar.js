import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };
  return (
    <nav className="navbar navbar-default navbar-cls-top" role="navigation" style={{ marginBottom: 0,backgroundColor:'grey' }}>
      <div className="navbar-header">
        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".sidebar-collapse">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <a style={{ marginLeft: -460, height: 90, marginBottom: -30, width: 269, marginTop: -42, lineHeight: '90px', backgroundColor: '#008080' }} className="navbar-brand" href="index.html">
          {user ? user.role : 'Loading...'}
        </a>
          </div>
      <div style={{ color: 'white', padding: '15px 50px 5px 50px', float: 'right',  fontSize: '16px' }}>
        <a href="#" style={{fontSize: '16px',marginTop:'-10px'}} className="btn btn-danger square-btn-adjust" onClick={handleLogout}>Logout</a>
      </div>
    </nav>
  );
};

export default Navbar;
