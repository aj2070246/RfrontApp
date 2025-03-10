const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_URL = "http://localhost:5000/Connection/SearchUsers";
const STATIC_DIR = "F:/CodeRepository/R/Front/RfrontApp/src/StaticPages";
const JSON_FILE = path.join(STATIC_DIR, 'users.json');

const generateProfilePages = async () => {
  if (!fs.existsSync(STATIC_DIR)) {
    fs.mkdirSync(STATIC_DIR, { recursive: true });
  }

  const response = await axios.post(API_URL, {}, { headers: { 'Content-Type': 'application/json' } });
  fs.writeFileSync(JSON_FILE, JSON.stringify(response.data, null, 2));

  const users = response.data.model;
  users.forEach((user) => {
    const userId = user.id;
    const profileFile = path.join(STATIC_DIR, `${userId}.html`);

    const html = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="${user.myDescription}">
        <meta name="keywords" content="${user.firstName}, ${user.province}, ${user.age}, دوست‌یابی">
        <title>${user.firstName} - پروفایل</title>
        <Link legacyBehavior href="https://fonts.googleapis.com/css2?family=Vazir&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Vazir', sans-serif; margin: 0; padding: 0; direction: rtl; }
          .container { max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 12px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          .image-box { position: relative; height: 140px; width: 100%; background-color: #f8bbd0; overflow: hidden; display: flex; align-items: center; justify-content: center; }
          img { max-height: 100%; max-width: 100%; object-fit: contain; }
          h1 { text-align: center; font-size: 2rem; font-weight: bold; margin: 10px 0; }
          .section { border: 1px solid #ccc; border-radius: 8px; padding: 10px; margin: 10px 0; }
          .section h2 { font-size: 1.5rem; font-weight: bold; margin: 0; }
          .section p { margin: 5px 0; max-height: 6.8em; overflow-y: auto; font-size: 1rem; }
          p { font-size: 1rem; margin: 5px 0; }
          .filter-box { margin: 20px 0; }
          .filter-box select { width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; background-color: #fff; cursor: pointer; }
          .filter-box select:focus { outline: none; border-color: #1976d2; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="image-box">
            <img src="/StaticPages/profile_photos/${user.id}.jpg" alt="Profile" 
                 onerror="this.onerror=null; this.src='/StaticPages/default_avatar.jpg';">
          </div>
          <h1>${user.firstName}</h1>

          <!-- منوهای فیلتر (دراپ‌دان‌ها) -->
          <div class="filter-box">
            <select disabled>
              <option value="">سن از: ${user.age} سال</option>
            </select>
            <select disabled>
              <option value="">استان: ${user.province}</option>
            </select>
            <select disabled>
              <option value="">وضعیت سلامت: ${user.healthStatus}</option>
            </select>
            <select disabled>
              <option value="">نوع زندگی: ${user.liveType}</option>
            </select>
            <select disabled>
              <option value="">وضعیت تأهل: ${user.marriageStatus}</option>
            </select>
          </div>

          <div class="section">
            <h2>درباره من</h2>
            <p>${user.myDescription}</p>
          </div>
          <div class="section">
            <h2>درباره پارتنر مورد نظر</h2>
            <p>${user.rDescription}</p>
          </div>
          <p>📅 تاریخ تولد: ${user.birthDate.split('T')[0]}</p>
          <p>🎂 سن: ${user.age} سال</p>
          <p>💙 وضعیت سلامت: ${user.healthStatus}</p>
          <p>🏡 نوع زندگی: ${user.liveType}</p>
          <p>❤️ وضعیت تأهل: ${user.marriageStatus}</p>
          <p>📍 استان: ${user.province}</p>
          <p>💰 درآمد: ${user.incomeAmount}</p>
          <p>🚗 ارزش خودرو: ${user.carValue}</p>
          <p>🏠 ارزش خانه: ${user.homeValue}</p>
          <p>🕒 آخرین فعالیت: ${user.lastActivityDate.split('T')[0]}</p>
          <p>🤝 نوع رابطه مورد نظر: ${user.relationType}</p>
          <p>📏 قد: ${user.ghad}</p>
          <p>⚖️ وزن: ${user.vazn}</p>
          <p>👶 تعداد فرزندان: ${user.cheildCount}</p>
          <p>👦 سن فرزند بزرگتر: ${user.firstCheildAge}</p>
          <p>🌕 رنگ پوست: ${user.rangePoost || 'نامشخص'}</p>
          <p>💄 میزان زیبایی: ${user.zibaeeNumber}</p>
          <p>🧑‍🦱 میزان خوش‌تیپی: ${user.tipNUmber}</p>
          <p>آخرین به‌روزرسانی: ${new Date().toLocaleString('fa-IR')}</p>
        </div>
      </body>
      </html>
    `;
    fs.writeFileSync(profileFile, html, 'utf8');
  });

  console.log('Static user profiles updated!');
};

generateProfilePages().catch(err => console.error(err));