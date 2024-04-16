import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import logoImage from '../../assets/images/allrs-new-logo-big.webp';

function MobileLogo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between items-center">
      <div className="w-[2rem]"></div>
      <div>
        <Link to="/" className="flex flex-col items-center">
          <img src={logoImage} className="w-[16rem] md:w-full center" alt="Logo" />
        </Link>
      </div>
      <div>
        <span onClick={() => setOpen(!open)}>
          {!open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8 cursor-pointer"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8 cursor-pointer"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
}

export default MobileLogo;
