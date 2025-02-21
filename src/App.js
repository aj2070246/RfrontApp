import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFile, FaSignOutAlt } from 'react-icons/fa';
import ChatPage from './pages/ChatPage';
import SearchPage from './pages/SearchPage';
import RegisterForm from "./pages/registerPage/RegisterForm";
import Login_Form from './pages/Login_Form';
import Profile from './pages/UsersProfile';
import UploadPicture from './pages/UploadPicture';
import UpdateProfile from './pages/UpdateProfile';

import './App.css'; // اضافه کردن فایل CSS

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // حذف توکن از localStorage
    localStorage.removeItem('userId'); // حذف توکن از localStorage
    navigate('/login'); // هدایت کاربر به صفحه لاگین
  };

  // بررسی اینکه آیا در صفحه لاگین هستیم یا نه
  const isLoginPage = window.location.pathname === '/login';
  const registerPage = window.location.pathname === '/registerForm';

  return (
    <div className="app-container">
      {/* دکمه همبرگری */}
      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
        <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
        <div className={`bar ${isMenuOpen ? 'active' : ''}`}></div>
      </div>
      <div className="banner">
        <p className="banner-text">به یاریاب خوش آمدید</p>
      </div>

      {/* منو لینک‌ها */}
      {!isLoginPage && !registerPage && (
        <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/search" className="nav-button">
                جستجوی کاربران
                <FaSearch />
              </Link>
            </li>
            <li>
              <Link to="/editProfile" className="nav-button">
                ویرایش پروفایل
                <FaFile />
              </Link>
            </li>
            <li>
              <button className="nav-button" onClick={handleLogout}>
                خروج
                <FaSignOutAlt />
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* تعریف مسیرهای اپلیکیشن */}
      <Routes>
        <Route path="/chat/:userId" element={<ChatPage />} />
        <Route path="/UploadPicture" element={<UploadPicture />} />
        <Route path="/update" element={<UpdateProfile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile/:stringId" element={<Profile />} />
        <Route path="/registerForm" element={<RegisterForm />} />
        <Route path="/login" element={<Login_Form />} />
      </Routes>
    </div>
  );
}

export default App;
