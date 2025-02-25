import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFile, FaSignOutAlt, FaTimes } from 'react-icons/fa'; // اضافه کردن آیکن بستن
import { FaBan, FaUserSlash, FaHeart, FaStar, FaEye, FaUserCircle } from "react-icons/fa";
import ChatPage from './pages/ChatPage';
import SearchPage from './pages/SearchPage';
import RegisterForm from "./pages/registerPage/RegisterForm";
import Login_Form from './pages/Login_Form';
import Profile from './pages/UsersProfile';
import UploadPicture from './pages/UploadPicture';
import UpdateProfile from './pages/UpdateProfile';
import Messages from './pages/Messages';

import BlockedUsers from "./pages/BlockedUsers";
import BlockedMeUsers from './pages/BlockedMeUsers';
import FavoritedMeUsers from './pages/FavoritedMeUsers';
import FavoriteUsers from './pages/FavoriteUsers';
import LastUsersCheckedMe from './pages/LastUsersCheckedMe';
import './App.css';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // برای تشخیص کلیک بیرون از منو
  const hamburgerRef = useRef(null); // برای تشخیص کلیک روی همبرگر
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const isLoginPage = window.location.pathname === '/login';
  const registerPage = window.location.pathname === '/registerForm';

  // استفاده از useEffect برای تشخیص کلیک بیرون از منو
  useEffect(() => {
    // اگر منو باز است و کاربر بیرون از منو کلیک کند، منو بسته می‌شود
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false); // منو را ببندید
      }
    };

    // اضافه کردن event listener به document
    document.addEventListener('click', handleClickOutside);

    // پاک کردن event listener هنگام خارج شدن از کامپوننت
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="app-container">
      {/* دکمه همبرگری */}
      <div className="hamburger" onClick={toggleMenu} ref={hamburgerRef}>
        <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
        <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
        <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
      </div>

      {/* منو لینک‌ها */}
      {!isLoginPage && !registerPage && (
        <nav className={`navbar ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
          <div className="close-icon" onClick={() => setIsMenuOpen(false)}>

            <span className="close-text">بستن</span> {/* کلمه بستن */}
            <FaTimes /> {/* آیکن بستن */}
          </div>

          <br />
          <br />

          <ul className="nav-links">
            <li>
              <Link to="/search" className="nav-button">
                کاربران
                <FaSearch />
              </Link>
            </li>
            <li>
              <Link to="/Messages" className="nav-button">
                مرکز پیام
                <FaFile />
              </Link>
            </li> <li>
              <Link to="/editProfile" className="nav-button">
                ویرایش پروفایل
                <FaFile />
              </Link>
            </li>
            <li>
              <Link to="/blocked" className="nav-button">
                مسدود شده ها
                <FaBan /> {/* آیکن ممنوعیت (بلاک) */}
              </Link>
            </li>

            <li>
              <Link to="/blockedMe" className="nav-button">
                مسدود کنندگان
                <FaUserSlash /> {/* آیکن کاربر حذف‌شده (برای نشان دادن بلاک) */}
              </Link>
            </li>

            <li>
              <Link to="/Favorite" className="nav-button">
                علاقه مندی های من
                <FaHeart /> {/* آیکن قلب (برای علاقه‌مندی‌ها) */}
              </Link>
            </li>

            <li>
              <Link to="/favoritedMe" className="nav-button">
                علاقه مندان به من
                <FaStar /> {/* آیکن ستاره (برای نشان دادن اهمیت) */}
              </Link>
            </li>

            <li>
              <Link to="/CheckedMe" className="nav-button">
               بازدیدکنندگان من
                <FaEye /> {/* آیکن چشم (برای نمایش بازدیدها) */}
              </Link>
            </li>

            <li>
              <Link to="/profileView" className="nav-button">
                مشاهده پروفایل خودم
                <FaUserCircle /> {/* آیکن پروفایل کاربر (برای نمایش پروفایل) */}
              </Link>
            </li>

            <li className="logout-button">
              <button className="nav-button" onClick={handleLogout}>
                خروج
                <FaSignOutAlt />
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* مسیرها */}
      <Routes>
        <Route path="/chat/:userId" element={<ChatPage />} />
        <Route path="/profile/:stringId" element={<Profile />} />
        <Route path="/UploadPicture" element={<UploadPicture />} />
        <Route path="/update" element={<UpdateProfile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/registerForm" element={<RegisterForm />} />
        <Route path="/login" element={<Login_Form />} />
     
        <Route path="/Messages" element={<Messages />} />
        <Route path="/blocked" element={<BlockedUsers />} />
        <Route path="/blockedMe" element={<BlockedMeUsers />} />
        <Route path="/favoritedMe" element={<FavoritedMeUsers />} />
        <Route path="/Favorite" element={<FavoriteUsers />} />
        <Route path="/CheckedMe" element={<LastUsersCheckedMe />} />
      </Routes>
    </div>
  );
}

export default App;
