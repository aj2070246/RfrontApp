
// src/api.js
import axios from 'axios';

// ایجاد یک نمونه axios با آدرس پایه
const api = axios.create({
  baseURL: 'http://localhost:5207', // آدرس پایه API
  timeout: 10000, // زمان تایم‌اوت برای درخواست‌ها
  headers: {
    'Content-Type': 'application/json',
    'accept': 'text/plain' 
}
});

// این متد برای ارسال درخواست جستجو به آدرس /x/search است
export const searchUsers = (genderssss, ageRange, location) => {
console.log('api called');

  return api.post('/Connection/SearchUsers', {
    pageIndex: 0,
  pageItemsCount: 0,
  ageIdFrom: 0,
  ageIdTo: 0,
  genderId: 0,
  healthStatusId: 0,
  liveTypeId: 0,
  marriageStatusId: 0,
  provinceId: 0,
  isOnline: true
  });
};

// می‌توانید متدهای دیگری هم برای API‌های دیگر اضافه کنید
// برای مثال: export const getUserDetails = () => {...}
