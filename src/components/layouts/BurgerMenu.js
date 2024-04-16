import { useState } from 'react';
import { Menu, Button } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

const BurgerMenu = () => {
  const [toggleBurgerFooter, setToggleBurgerFooter] = useState(false);
  const [toggleBurgerMainMenu, setToggleBurgerMainMenu] = useState(false);

  return (
    <div id="burger-wrapper">
      {/* Footer button */}
      <span onClick={() => setToggleBurgerFooter(!toggleBurgerFooter)} className="hidden sm:block">
        <Button type="text" icon={<MenuOutlined />} />
      </span>

      {/* Main menu button */}
      <span onClick={() => {
          setToggleBurgerMainMenu(!toggleBurgerMainMenu);
          setToggleBurgerFooter(false); // Close footer menu when main menu is opened
        }} className="block sm:hidden">
        <Button type="text" icon={<MenuOutlined />} />
      </span>

      {/* Main menu section */}
      {toggleBurgerMainMenu && (
        <div className="block sm:hidden">
          {/* Your main menu content here */}
          <div className="w-full h-full inset-0 fixed bg-white z-[9999]">
            {/* Your main menu content */}
          </div>
        </div>
      )}

      {/* Burger modal */}
      {toggleBurgerFooter && (
        <div className="fixed w-full h-screen overflow-scroll md:overflow-auto bg-neutral-800 bg-opacity-50 top-0 left-0 hidden sm:flex flex-col justify-start items-start z-40">
          {/* Your burger menu content here */}
          <div id="close-button" className="inline-block">
            <Button type="text" icon={<CloseOutlined />} onClick={() => setToggleBurgerFooter(false)} />
          </div>
          <div className="w-full max-w-6xl mx-auto text-right mt-4 md:mt-12 px-12">
            {/* Close button */}
            <span className="inline-block">
              <Button type="text" icon={<CloseOutlined />} onClick={() => setToggleBurgerFooter(false)} />
            </span>
            {/* Your footer menu content */}
          </div>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;
