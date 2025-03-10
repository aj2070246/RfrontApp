import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Link from 'next/link';

import { FaSignInAlt, FaUserPlus, FaCommentDots, FaSearch, FaFile, FaSignOutAlt, FaTimes } from 'react-icons/fa'; // اضافه کردن آیکن بستن
// import { Navigate } from 'react-router-dom';
import { Box, Card, CardContent, CardMedia, Typography, Alert, CardActionArea } from '@mui/material';
import { GetCountOfUnreadMessages, LastUsersCheckedMeApi, getDefaultAvatarAddress, getUserProfilePhoto } from './api'; // اضافه کردن متد جدید
import Head from 'next/head';
import { useRouter } from 'next/router'; // وارد کردن useRouter

import { FaBars, FaBan, FaUserSlash, FaHeart, FaStar, FaEye, FaUserCircle } from "react-icons/fa";
import ChatPage from './chat/[userId]';
import SearchPage from './search';
import RegisterForm from "./RegisterForm";
import Login_Form from './login';
import Profile from './profile/[stringId]';
import UploadPicture from './UploadPicture';
import UpdateProfile from './update';
import Messages from './Messages';
import BlockedUsers from "./blocked";
import BlockedMeUsers from './blockedMe';
import FavoritedMeUsers from './favoritedMe';
import FavoriteUsers from './favorited';
import LastUsersCheckedMe from './CheckedMe';
import ForgatePassword from './ForgatePassword';
import '../pages/styles/App.css'; // اگر فایل CSS در پوشه styles است

function App() {
  return (
    <Main>
      <Login_Form />
      <ChatPage />
      <Profile />
      <UploadPicture />
      <UpdateProfile />
      <SearchPage />
      <RegisterForm />
      <Messages />
      <BlockedUsers />
      <BlockedMeUsers />
      <FavoritedMeUsers />
      <FavoriteUsers />
      <LastUsersCheckedMe />
      <ForgatePassword />
    </Main>
  );

}

function Main() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // وضعیت منوی نام و نام خانوادگی
  const menuRef = useRef(null); // برای تشخیص کلیک بیرون از منو
  const hamburgerRef = useRef(null); // برای تشخیص کلیک روی همبرگر
  const userMenuRef = useRef(null); // برای تشخیص کلیک بیرون از منوی نام و نام خانوادگی
  const router = useRouter(); // استفاده از useRouter برای ناوبری

  const [isRoot, setIsRoot] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [isRegisterPage, setIsRegisterPage] = useState(false);
  const [forgatePassword, setForgatePassword] = useState(false);
  const [search, setSearch] = useState(false);
  const [userId, setUserId] = useState(null);
  const [hideHeaderAndMenu, setHideHeaderAndMenu] = useState(false);
  const [searchNeedMenu, setSearchNeedMenu] = useState(false);


  const [gender, setGender] = useState(null);
  const [firstName, setFirstName] = useState(null);

  const [profilePhoto, setProfilePhoto] = useState(null); // حالت برای عکس پروفایل
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0); // حالت برای تعداد پیام‌های خوانده‌نشده
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen); // تغییر وضعیت منوی نام و نام خانوادگی
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login'); // استفاده از router.push برای ناوبری به صفحه لاگین

  };

  useEffect(() => {
    const storedGender = localStorage.getItem('gender');
    const storedFirstName = localStorage.getItem('firstName');
    setGender(storedGender);
    setFirstName(storedFirstName);
  }, []);

  useEffect(() => {
    // بررسی مسیر URL فقط زمانی که صفحه در سمت کلاینت رندر می‌شود
    const path = router.pathname.toLowerCase();
    setIsRoot(path === '/');
    setIsLoginPage(path === '/login');
    setIsRegisterPage(path === '/registerForm');
    setForgatePassword(path === '/ForgatePassword');
    setSearch(path === '/search');
    setUserId(localStorage.getItem('userId'));

    // مخفی کردن هدر و منو
    setHideHeaderAndMenu(isRoot || isLoginPage || isRegisterPage || forgatePassword);

    // بررسی نیاز به منو در صفحه جستجو
    setSearchNeedMenu(search && !userId);
  }, [router.pathname]);

  useEffect(() => {
    // اگر منو باز است و کاربر بیرون از منو کلیک کند، منو بسته می‌شود
    const handleClickOutside = (event) => {
      if (
        (menuRef.current && !menuRef.current.contains(event.target)) &&
        (userMenuRef.current && !userMenuRef.current.contains(event.target)) &&
        (hamburgerRef.current && !hamburgerRef.current.contains(event.target))
      ) {
        setIsMenuOpen(false); // منو را ببندید
        setIsUserMenuOpen(false); // منوی نام و نام خانوادگی را ببندید
      }
    };

    // اضافه کردن event listener به document
    document.addEventListener('click', handleClickOutside);

    // پاک کردن event listener هنگام خارج شدن از کامپوننت
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const [isInIframe, setIsInIframe] = useState(false);
  useEffect(() => {
    setIsInIframe(window.self !== window.top);
    const fetchProfilePhoto = async () => {
      const userId = localStorage.getItem('userId');
      const genderId = localStorage.getItem('genderId');
      if (userId) {
        const photoUrl = await getUserProfilePhoto(userId, genderId);
        console.log('Photo URL:', photoUrl); // چک کن چی برگشته
        setProfilePhoto(photoUrl);
      }
    };
    fetchProfilePhoto();
  }, []);

  useEffect(() => {
    const fetchUnreadMessagesCount = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await GetCountOfUnreadMessages(); // فرض می‌کنم این تابع توی api.js تعریف شده
        console.log('Unread Messages Count:', response); // چک کن چی برگشته
        if (response.data.isSuccess) {
          setUnreadMessagesCount(response.data.model);
          console.log('(response.data.isSuccess , ', response.data.isSuccess);
          console.log('(response.data.model , ', response.data.model);
        }
      }
    };
    fetchUnreadMessagesCount();
  }, []);

  return (
    <div className="app-container">
      <Head>
        <title>همسر یابی همسریار</title>
      </Head>

      {!hideHeaderAndMenu && !isInIframe && (
        <>
          <header className="header">
            <div className="hamburger-container" onClick={toggleMenu} ref={hamburgerRef}>
              <div className="hamburger" onClick={toggleMenu} ref={hamburgerRef}>
                <FaBars className="hamburger" onClick={toggleMenu} ref={hamburgerRef} /> {/* آیکن همبرگر */}
              </div>
              <span className="hamburger-text" onClick={toggleMenu} ref={hamburgerRef}>امکانات</span>
            </div>

            <div className="header-center">
              به سامانه همسریابی همسریار  خوش  آمدین
            </div>

            <div className="user-info user-name user-name-left" ref={userMenuRef}>
              <span className="user-name user-name-left" onClick={toggleUserMenu}>
                <Link legacyBehavior href="/Messages" passHref>
                  <a className="nav-button messages-link">
                    <FaCommentDots style={{ fontSize: '24px' }} /> {/* سایز بزرگ‌تر */}
                    <span className="unread-count">{unreadMessagesCount}</span>
                  </a>
                </Link>
                <span>{gender} {' '} {firstName}</span>
              </span>

              <img
                src={profilePhoto} // استفاده از state به جای تابع مستقیم
                alt="همسریابی | دوستیابی | همسریار"
                style={styles.profileImage}
                onClick={toggleUserMenu}
                onError={(e) => {
                  e.target.onerror = null;
                  const genderId = localStorage.getItem('genderId');
                  e.target.src = getDefaultAvatarAddress(genderId); // مستقیم از متغیر ثابت استفاده کن
                }}
              />

              {isUserMenuOpen && (
                <div className="user-menu">
                  <button>
                    <Link legacyBehavior href={`/profile/${localStorage.getItem('userId')}`} passHref>
                      <a className="nav-button">
                        مشاهده پروفایل خودم
                        <FaUserCircle /> {/* آیکن پروفایل کاربر (برای نمایش پروفایل) */}
                      </a>
                    </Link>
                  </button>
                  <button>
                    <Link legacyBehavior href="/Messages" passHref>
                      <a className="nav-button messages-link">
                        {unreadMessagesCount > 0 ? (
                          <>    'تعداد'
                            <span className="unread-count"> {unreadMessagesCount} </span>
                            'پیام جدید'
                          </>
                        ) : (
                          <>
                            <span className="unread-count"></span>
                            پیام جدید ندارید
                          </>
                        )}
                        <br />
                        <FaCommentDots style={{ fontSize: '24px' }} /> {/* سایز بزرگ‌تر */}
                      </a>
                    </Link>
                  </button>

                  <button>
                    <Link legacyBehavior href="/update" passHref>
                      <a className="nav-button">
                        ویرایش پروفایل
                        <FaFile />
                      </a>
                    </Link>
                  </button>
                  <button className="nav-button" onClick={handleLogout}>
                    خروج
                    <FaSignOutAlt />
                  </button>
                </div>
              )}
            </div>
          </header>

          <nav className={`navbar ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
            <div className="close-icon" onClick={() => setIsMenuOpen(false)}>
              <span className="close-text">بستن</span> {/* کلمه بستن */}
              <FaTimes /> {/* آیکن بستن */}
            </div>

            <br />
            <br />

            <ul className="nav-links">
              <li>
                <Link legacyBehavior href="/search" passHref>
                  <a className="nav-button">
                    کاربران
                    <FaSearch />
                  </a>
                </Link>
              </li>
              <li>
                <Link legacyBehavior href="/Messages" passHref>
                  <a className="nav-button  nav-button messages-link">
                    مرکز پیام
                    <FaCommentDots style={{ fontSize: '24px' }} /> {/* سایز بزرگ‌تر */}
                    <span className="unread-count">{unreadMessagesCount}</span>
                  </a>
                </Link>
              </li>

              <li>
                <Link legacyBehavior href="/blocked" passHref>
                  <a className="nav-button">
                    مسدود شده ها
                    <FaBan /> {/* آیکن ممنوعیت (بلاک) */}
                  </a>
                </Link>
              </li>

              <li>
                <Link legacyBehavior href="/blockedMe" passHref>
                  <a className="nav-button">
                    مسدود کنندگان
                    <FaUserSlash /> {/* آیکن کاربر حذف‌شده (برای نشان دادن بلاک) */}
                  </a>
                </Link>
              </li>

              <li>
                <Link legacyBehavior href="/Favorite" passHref>
                  <a className="nav-button">
                    علاقه مندی های من
                    <FaHeart /> {/* آیکن قلب (برای علاقه‌مندی‌ها) */}
                  </a>
                </Link>
              </li>

              <li>
                <Link legacyBehavior href="/favoritedMe" passHref>
                  <a className="nav-button">
                    علاقه مندان به من
                    <FaStar /> {/* آیکن ستاره (برای نشان دادن اهمیت) */}
                  </a>
                </Link>
              </li>

              <li>
                <Link legacyBehavior href="/CheckedMe" passHref>
                  <a className="nav-button">
                    بازدیدکنندگان من
                    <FaEye /> {/* آیکن چشم (برای نمایش بازدیدها) */}
                  </a>
                </Link>
              </li>

              <li className="logout-button">
                <Link legacyBehavior href="/" passHref>
                  <a className="nav-button" onClick={handleLogout}>
                    خروج
                    <FaUserCircle />
                  </a>
                </Link>
              </li>
            </ul>
          </nav>

        </>
      )}

      {searchNeedMenu && !isInIframe && (
        <>
          <header className="header" style={{ backgroundColor: '#2196F3' }}>
            <div className="header-center">
              خوش آمدید
            </div>

            <div className="header-buttons">
              <Link legacyBehavior href="/login" passHref>
                <a className="header-button">
                  <FaSignInAlt style={{ marginLeft: '5px' }} />
                  ورود
                </a>
              </Link>
              <Link legacyBehavior href="/registerForm" passHref>
                <a className="header-button">
                  <FaUserPlus style={{ marginLeft: '5px' }} />
                  ثبت‌نام
                </a>
              </Link>
            </div>
          </header>
        </>
      )}

    </div>
  );



}
const styles = {
  profileImage: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  userNameContainer: {
    display: 'flex',
    alignItems: 'center', // برای تراز عمودی آیکن و متن
  },
};



export default App;