import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown} from 'antd';
import { HomeModernIcon } from '@heroicons/react/24/outline'; 
import {
  UserOutlined,
  ShoppingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  DatabaseOutlined, 
  TagsOutlined
} from '@ant-design/icons';

import LogoImage from '../assets/images/allrs-logo-demi-bold.png';

const { Header, Content, Sider, Footer } = Layout;
const { SubMenu } = Menu;

const avatarMenu = (
  <Menu>
    <Menu.Item key="1">
      My Account
    </Menu.Item>
    <Menu.Item key="2">
      Logout
    </Menu.Item>
  </Menu>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMasterdataCollapsed, setIsMasterdataCollapsed] = useState(() => {
    const saved = localStorage.getItem('masterdataCollapsed');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('masterdataCollapsed', JSON.stringify(isMasterdataCollapsed));
  }, [isMasterdataCollapsed]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMasterdata = () => {
    setIsMasterdataCollapsed(prevState => !prevState);
  };

  const getSelectedKey = () => {
    const path = location.pathname;

    // if (path.includes('/dashboard/brands')) return '/dashboard/brands';
    // if (path.includes('/dashboard/add-brand')) return '/dashboard/brands';
    // if (path.includes('/dashboard/edit-brand')) return '/dashboard/brands';
    // if (path.includes('/dashboard/categories')) return '/dashboard/categories';
    // if (path.includes('/dashboard/add-category')) return '/dashboard/categories';
    // if (path.includes('/dashboard/edit-category')) return '/dashboard/categories';
    // if (path.includes('/dashboard/sub-categories')) return '/dashboard/sub-categories';
    // if (path.includes('/dashboard/add-sub-category')) return '/dashboard/sub-categories';
    // if (path.includes('/dashboard/edit-sub-category')) return '/dashboard/sub-categories';
    // if (path.includes('/dashboard/sub-headings')) return '/dashboard/sub-headings';
    // if (path.includes('/dashboard/add-sub-heading')) return '/dashboard/sub-headings';
    // if (path.includes('/dashboard/edit-sub-heading')) return '/dashboard/sub-headings';
    // if (path.includes('/dashboard/retail-stores')) return '/dashboard/retail-stores';
    // if (path.includes('/dashboard/add-retail-store')) return '/dashboard/retail-stores';
    // if (path.includes('/dashboard/edit-retail-store')) return '/dashboard/retail-stores';
    // if (path.includes('/dashboard/highlights')) return '/dashboard/highlights';
    // if (path.includes('/dashboard/add-highlight')) return '/dashboard/highlights';
    // if (path.includes('/dashboard/edit-highlight')) return '/dashboard/highlights';
    // if (path.includes('/dashboard/sub-filters')) return '/dashboard/sub-filters';
    // if (path.includes('/dashboard/add-sub-filter')) return '/dashboard/sub-filters';
    // if (path.includes('/dashboard/edit-sub-filter')) return '/dashboard/sub-filters';
    // if (path.includes('/dashboard/filters')) return '/dashboard/filters';
    // if (path.includes('/dashboard/add-filter')) return '/dashboard/filters';
    // if (path.includes('/dashboard/edit-filter')) return '/dashboard/filters';
    // if (path.includes('/dashboard/ingredients')) return '/dashboard/ingredients';
    // if (path.includes('/dashboard/add-ingredient')) return '/dashboard/ingredients';
    // if (path.includes('/dashboard/edit-ingredient')) return '/dashboard/ingredients';
    // if (path.includes('/dashboard/product-tags')) return '/dashboard/product-tags';
    // if (path.includes('/dashboard/add-product-tag')) return '/dashboard/product-tags';
    // if (path.includes('/dashboard/edit-product-tag')) return '/dashboard/product-tags';
    if (path.includes('/dashboard/projects')) return '/dashboard/projects';
    if (path.includes('/dashboard/add-projects')) return '/dashboard/projects';
    if (path.includes('/dashboard/edit-projects')) return '/dashboard/projects';

    if (path.includes('/dashboard/members')) return '/dashboard/members';
    if (path.includes('/dashboard/add-member')) return '/dashboard/members';
    if (path.includes('/dashboard/edit-member')) return '/dashboard/members';
  };

  const handleMenuSelect = ({ key }) => {
      console.log(key)
      setIsMasterdataCollapsed(true);
      navigate(key);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!authService.isAuthenticated()) {
    navigate('/login');
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={256}
        theme="dark"
        collapsed={collapsed}
        collapsible
        onCollapse={toggleSidebar}
        trigger={null}
      >
        <div
          className="logo"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80px',
          }}
        >
          <img
            src={LogoImage}
            alt="Logo"
            style={{ maxWidth: '100%', maxHeight: '50px' }}
          />
        </div>
        <Menu
          defaultSelectedKeys={[getSelectedKey()]}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          onSelect={handleMenuSelect}
        >
<Menu.Item key="/dashboard/members" icon={<UserOutlined />}>
        Members
      </Menu.Item>
      <Menu.Item key="/dashboard/properties" icon={<HomeModernIcon className="h-5 w-5" />}>
        Projects
      </Menu.Item>
          
          <SubMenu
            key="/dashboard/masterdata"
            icon={<DatabaseOutlined />}
            title="Masterdata"
            onTitleClick={toggleMasterdata}
            popupClassName={isMasterdataCollapsed ? 'collapsed-submenu' : ''}
          >
            {/* <Menu.Item key="/dashboard/brands">Brands</Menu.Item>
            <Menu.Item key="/dashboard/categories">Categories</Menu.Item>
            <Menu.Item key="/dashboard/filters">Filters</Menu.Item>
            <Menu.Item key="/dashboard/highlights">Highlights</Menu.Item>
            <Menu.Item key="/dashboard/ingredients">Ingredients</Menu.Item>
            <Menu.Item key="/dashboard/retail-stores">Retail Stores</Menu.Item>
            <Menu.Item key="/dashboard/sub-categories">Sub-Categories</Menu.Item>
            <Menu.Item key="/dashboard/sub-filters">Sub-Filters</Menu.Item>
            <Menu.Item key="/dashboard/sub-headings">Sub-Headings</Menu.Item> */}


          </SubMenu>
        </Menu>
        <Menu
          mode="vertical"
          theme="dark"
          style={{ lineHeight: '64px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
          onClick={handleLogout}
        >
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 10 }}>
          {collapsed ? (
            <MenuUnfoldOutlined onClick={toggleSidebar} />
          ) : (
            <MenuFoldOutlined onClick={toggleSidebar} />
          )}
           <Dropdown overlay={avatarMenu} trigger={['click']} placement="bottomRight">
            <Avatar icon={<UserOutlined />} style={{ float: 'right', marginRight: '16px', cursor: 'pointer' }} />
          </Dropdown>
        
        </Header>
        <Content style={{ margin: '24px 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              // background: '#fff',
              // borderRadius: '8px',
              // boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{
  textAlign: 'center',
  borderTop: '1px solid #e8e8e8', // Adds a light grey top border
  padding: '20px 0' // Adds padding to the top and bottom of the footer content
}}>
  Copyright © {new Date().getFullYear()}  Saturn Project
</Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
