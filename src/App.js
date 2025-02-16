
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ChatPage from './pages/ChatPage'; // صفحه چت
import SearchPage from './pages/SearchPage'; // صفحه جستجو (اگر هنوز ایجاد نکردید)

function App() {
  return (
    <Router>
      <div>
        {/* push test لینک به صفحه چت و جستجو */}
        <nav>
          <ul>
            <li>
              <Link to="/chat">به صفحه چت برو</Link>
            </li>
            <li>
              <Link to="/search">به صفحه جستجو برو</Link>
            </li>
          </ul>
        </nav>

        {/* تعریف مسیرهای اپلیکیشن */}
        <Routes>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/search" element={<SearchPage />} />
          {/* می‌توانید مسیرهای دیگه رو هم اینجا اضافه کنید */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;