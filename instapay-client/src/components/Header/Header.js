import React from 'react';
import { Link } from 'react-router-dom';
import { Label } from 'semantic-ui-react';
import './Header.scss';

const Header = () => {
  return (
    <div className="headerHolder">
      <div className="headerLogo"></div>
      <div className="headerLinks">
        {/* <Label basic as={Link} to={'/'}>
          Trgovci
        </Label> */}
        <div className="link">
          <Link to={'/'}>
            <h4 style={{ color: 'white' }}>Trgovci</h4>
          </Link>
        </div>
        <div className="link">
          <Link to={'/'}>
            <h4 style={{ color: 'white' }}>Države</h4>
          </Link>
        </div>
        <div className="link">
          <Link to={'/'}>
            <h4 style={{ color: 'white' }}>Gradovi</h4>
          </Link>
        </div>
        <div className="link">
          <Link to={'/users'}>
            <h4 style={{ color: 'white' }}>Korisnici</h4>
          </Link>
        </div>
        <div className="link">
          <Link to={'/'}>
            <h4 style={{ color: 'white' }}>Provizije</h4>
          </Link>
        </div>
      </div>
      <div className="headerAccount"></div>
    </div>
  );
};

export default Header;
