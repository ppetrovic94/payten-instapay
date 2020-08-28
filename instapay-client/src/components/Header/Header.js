import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'semantic-ui-react';
import axios from '../../utils/API';
import Logo from './Logo';
import './Header.scss';
import { useAuthDataContext } from '../../security/AuthDataProvider/AuthDataProvider';

const Header = () => {
  const { roles } = useAuthDataContext();
  const history = useHistory();
  const [activeItem, setActiveItem] = useState('');
  const onItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  const onLogout = async () => {
    try {
      await axios.get('/logout');
      document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      history.push('/');
    } catch (error) {
      console.log(error, 'logout err');
    }
  };

  return (
    <div className="headerHolder">
      <div className="headerLogo">
        <Logo />
      </div>
      <div className="headerLinks">
        <Menu size={'large'} inverted>
          {roles && !!roles.find((role) => role === 'ROLE_USER') && (
            <>
              <Menu.Item
                as={Link}
                to={'/merchants'}
                name="Trgovci"
                active={activeItem == 'Trgovci'}
                onClick={onItemClick}
              />
              <Menu.Item
                as={Link}
                to={'/cities'}
                name={`Gradovi`}
                active={activeItem == 'Gradovi'}
                onClick={onItemClick}
              />
              <Menu.Item
                as={Link}
                to={'/fees'}
                name="Provizije"
                active={activeItem == 'Provizije'}
                onClick={onItemClick}
              />
            </>
          )}
          {roles && !!roles.find((role) => role === 'ROLE_ADMIN') && (
            <>
              {!!roles.find((role) => role === 'ROLE_USER') ? (
                <Menu.Item name="Korisnici" active={activeItem == 'Korisnici'}>
                  <Dropdown text={'Korisnici'}>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        to={'/users'}
                        onClick={(e) => onItemClick(e, { name: 'Korisnici' })}>
                        Lista korisnika
                      </Dropdown.Item>
                      <Dropdown.Item
                        as={Link}
                        to={'/groups'}
                        onClick={(e) => onItemClick(e, { name: 'Korisnici' })}>
                        Administracija grupa
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Item>
              ) : (
                <>
                  <Menu.Item
                    as={Link}
                    to={'/users'}
                    name={`Korisnici`}
                    active={activeItem == 'Korisnici'}
                    onClick={onItemClick}
                  />
                  <Menu.Item
                    as={Link}
                    to={'/groups'}
                    name="Grupe"
                    active={activeItem == 'Grupe'}
                    onClick={onItemClick}
                  />
                </>
              )}
            </>
          )}
          {roles && !!roles.find((role) => role === 'ROLE_ACQ') && (
            <>
              <Menu.Item
                as={Link}
                to={'/reports'}
                name="Izveštaji"
                active={activeItem == 'Izveštaji'}
                onClick={onItemClick}
              />
            </>
          )}
        </Menu>
      </div>
      <div className="logout">
        <Link className="logoutContainer" onClick={onLogout} to="/">
          <Icon className="logoutIcon" name={'log out'} size="large" />
          <p className="logoutLabel">Odjavi se</p>
        </Link>
      </div>
    </div>
  );
};

export default Header;
