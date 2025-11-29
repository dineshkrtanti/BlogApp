import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CiLogin } from "react-icons/ci";

const Header = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  
  // Check if user is logged in
  const isLogin = localStorage.getItem('userId');

  const handleLogout = () => {
    try {
      localStorage.clear();
      toast.success('Logout Successfully');
      navigate('/login');
      setIsOpen(false); // Close menu on logout
    } catch (error) {
      console.log(error);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-green-600 tracking-tighter" onClick={closeMenu}>
            CARD Charity Blog
          </Link>

          {/* DESKTOP Navigation (Hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-green-600 font-medium transition">
              Home
            </Link>
            
            {isLogin && (
              <>
                <Link to="/my-blogs" className="text-gray-600 hover:text-green-600 font-medium transition">
                  Manage Blogs
                </Link>
                <Link to="/create-blog" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md">
                  Write New Blog
                </Link>
              </>
            )}

            {!isLogin ? (
             <Link
  to="/login"
  className="px-5 py-1 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-100 transition font-medium flex items-center gap-2"
>
  <CiLogin className="text-lg " />
  <span>Login</span>
</Link>
            ) : (
             <button
             onClick={handleLogout}
  className="px-5 py-1 border-2 border-red-700 text-red-700 rounded-lg hover:bg-red-50 transition font-medium flex items-center gap-2"
>
  <CiLogin className="text-lg " />
  <span>Logout</span>
</button>
            )}
          </div>

          {/* MOBILE Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-green-600 focus:outline-none"
            >
              {/* Toggle Icon: Show X if open, Hamburger if closed */}
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE Navigation Dropdown */}
      {/* Only render if isOpen is true */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-green-100 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
            <Link 
              to="/" 
              onClick={closeMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
            >
              Home
            </Link>

            {isLogin && (
              <>
                <Link 
                  to="/my-blogs" 
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50"
                >
                  Manage Blogs
                </Link>
                <Link 
                  to="/create-blog" 
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-green-600 bg-green-50 border border-green-200"
                >
                  Write New Blog
                </Link>
              </>
            )}

            {!isLogin ? (
              <Link 
                to="/login" 
                onClick={closeMenu}
                className="block w-full text-center mt-4 px-5 py-3 border-2 border-green-600 text-green-600 rounded-lg font-bold hover:bg-green-50"
              >
                Login
              </Link>
            ) : (
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 mt-2"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;