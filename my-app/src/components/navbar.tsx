import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar: React.FC = () => {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-screen-xl mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-lg font-bold text-white no-underline hover:text-gray-400 transition duration-300 ease-in-out">
          Logo
        </Link>
        <ul className="flex items-center justify-end space-x-6">
          <li className="mr-4"><Link to="/about" className="text-lg text-white no-underline hover:text-gray-400 transition duration-300 ease-in-out">About</Link></li>
          <li><Link to="/contact" className="text-lg text-white no-underline hover:text-gray-400 transition duration-300 ease-in-out">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;