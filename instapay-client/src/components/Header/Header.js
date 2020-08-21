import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown } from 'semantic-ui-react';
import Logo from './Logo';
import './Header.scss';
import { useAuthDataContext } from '../../security/AuthDataProvider/AuthDataProvider';

const Header = () => {
  const { roles } = useAuthDataContext();
  const [activeItem, setActiveItem] = useState('');
  const onItemClick = (e, { name }) => {
    setActiveItem(name);
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
                      Administracija grupa/uloga
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
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
    </div>
  );
};

export default Header;
