import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";  // Updated to useNavigate
import logo from "../assets/logo.png";
import "../styles/header.scss";
import { useGetUserQuery, useLogoutMutation } from "../redux/reducers/user/useThunk";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: user } = useGetUserQuery();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate(); // Updated from useHistory

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.header__menu-toggle')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    // Prevent scrolling when sidebar is open
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  const signOutUser = () => {
    logout()
      .then((res) => {
        console.log(res);
        localStorage.removeItem("token");
        navigate("/login"); // Updated to use navigate
        window.location.reload()
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__logo-container">
            <Link to="/" className="header__logo-link">
              <img src={logo} alt="logo todo" className="header__logo" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          {user ? (
            <div className="header__nav-desktop">
              <span className="header__welcome">Hi, {user?.email}</span>
              <button onClick={signOutUser} className="header__logout-btn">Logout</button>
            </div>
          ) : (
            <nav className="header__nav-desktop">
              <ul className="header__nav-list">
                <li className="header__nav-item">
                  <Link to="/login" className="header__nav-link">Login</Link>
                </li>
                <li className="header__nav-item">
                  <Link to="/signup" className="header__nav-link header__nav-link--primary">Sign Up</Link>
                </li>
              </ul>
            </nav>
          )}

          {/* Mobile menu button */}
          <button 
            onClick={toggleSidebar}
            className="header__menu-toggle"
            aria-expanded={isSidebarOpen}
          >
            <span className="visually-hidden">Open main menu</span>
            {isSidebarOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

    
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'sidebar-overlay--active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />
  
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <img src={logo} alt="logo todo" className="sidebar__logo" />
          <button 
            className="sidebar__close" 
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
         <nav className="sidebar__nav">
            {
              user ?
               <>
                 <span>Hi {user?.email}</span>
                  <button onClick={signOutUser}>Logout</button>
               </>
               :
               <ul className="sidebar__nav-list">
              <li className="sidebar__nav-item">
                <Link 
                  to="/login" 
                  className="sidebar__nav-link"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Login
                </Link>
              </li>
              <li className="sidebar__nav-item">
                <Link 
                  to="/signup" 
                  className="sidebar__nav-link sidebar__nav-link--primary"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Sign Up
                </Link>
              </li>
               </ul>
            }
          </nav>
        
      </aside>

           
    </>
  );
};

export default Header;
