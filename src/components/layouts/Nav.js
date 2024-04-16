import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

function Navbar({ current_user, handleLogout }) {
  const [open, setOpen] = useState(false);

  // Dropdown menu for Portfolio
  const portfolioMenu = (
    <Menu>
      <Menu.Item key="brands">
        <Link to="/our-brands">Our Brands</Link>
      </Menu.Item>
      <Menu.Item key="properties">
        <Link to="/our-properties">Our Properties</Link>
      </Menu.Item>
    </Menu>
  );

  // Dropdown menu for Contact Us
  const contactMenu = (
    <Menu>
      <Menu.Item key="chat" onClick={() => FB.CustomerChat.show()}>
        Chat with Us
      </Menu.Item>
      <Menu.Item key="email">
        <Link to="/contact">Email Us</Link>
      </Menu.Item>
    </Menu>
  );

  // Dropdown menu for Join Us
  const joinMenu = (
    <Menu>
      <Menu.Item key="broker">
        <Link to={current_user ? "#" : "/join-broker"} className={current_user ? 'ant-dropdown-menu-item-disabled' : ''} title={current_user ? 'You are already logged in.' : ''}>Broker</Link>
      </Menu.Item>
      <Menu.Item key="team">
        <Link to="/join-team">Join Our Team</Link>
      </Menu.Item>
    </Menu>
  );

  // Dropdown menu for My Account
  const accountMenu = (
    <Menu>
      {current_user.role === UserRoleType.INTERNAL ? (
        <Menu.Item key="my-account">
          <Link to="/my-account">My Account</Link>
        </Menu.Item>
      ) : (
        <Menu.Item key="external-account">
          <Link to="/external-account" data-turbo={false}>My Account</Link>
        </Menu.Item>
      )}
      <Menu.Item key="logout" onClick={() => handleLogout()}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="bg-white md:bg-transparent fixed w-full top-0 sm:relative py-2 md:py-4 z-50">
      <div className="max-w-7xl mx-auto px-2 md:px-8">
        {/* Logo */}
        <div className="w-full">
          <Link to="/">
            <img src="allrs-new-logo-big.webp" alt="Logo" className="w-full" />
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <Menu mode="horizontal" className="hidden md:flex md:w-3/4">
          <Menu.Item key="home" className="sm:hidden">
            <Link to="/">HOME</Link>
          </Menu.Item>
          <Menu.Item key="about">
            <Link to="/about">ABOUT US</Link>
          </Menu.Item>
          <Menu.Item key="services">
            <Link to="/services">OUR SERVICES</Link>
          </Menu.Item>
          <Dropdown overlay={portfolioMenu}>
            <span className="ant-dropdown-link cursor-pointer">OUR PORTFOLIO <DownOutlined /></span>
          </Dropdown>
          {/* Other menu items */}
        </Menu>

        {/* Mobile Menu */}
        <div className="md:hidden">
          {/* Render burger mobile */}
          <BurgerMobile />
        </div>

        {/* Mobile Menu Content */}
        <div className={`absolute top-16 right-0 bg-white w-full md:hidden ${open ? 'block' : 'hidden'}`}>
          <Menu mode="vertical">
            <Menu.Item key="home" className="sm:hidden">
              <Link to="/">HOME</Link>
            </Menu.Item>
            <Menu.Item key="about">
              <Link to="/about">ABOUT US</Link>
            </Menu.Item>
            <Menu.Item key="services">
              <Link to="/services">OUR SERVICES</Link>
            </Menu.Item>
            <Menu.SubMenu key="portfolio" title="OUR PORTFOLIO">
              <Menu.Item key="brands">
                <Link to="/our-brands">Our Brands</Link>
              </Menu.Item>
              <Menu.Item key="properties">
                <Link to="/our-properties">Our Properties</Link>
              </Menu.Item>
            </Menu.SubMenu>
            {/* Other mobile menu items */}
          </Menu>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
