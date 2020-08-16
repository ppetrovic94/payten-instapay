import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown } from 'semantic-ui-react';
import Logo from './Logo';
import './Header.scss';

const Header = () => {
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
          <Menu.Item
            as={Link}
            to={'/'}
            name="Trgovci"
            active={activeItem == 'Trgovci'}
            onClick={onItemClick}
          />
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
          <Menu.Item
            as={Link}
            to={'/'}
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
          <Menu.Item
            as={Link}
            to={'/reports'}
            name="Izveštaji"
            active={activeItem == 'Izveštaji'}
            onClick={onItemClick}
          />
        </Menu>
      </div>
      {/* <div className="headerAccount"></div> */}
    </div>
  );
};

export default Header;
