
// src/api.js
import axios from 'axios';

// ایجاد یک نمونه axios با آدرس پایه
const api = axios.create({
  baseURL: 'http://127.0.0.1:5207', // آدرس پایه API
  timeout: 10000, // زمان تایم‌اوت برای درخواست‌ها
  headers: {
      'accept': 'text/plain',
      'Content-Type': 'application/json',
  
},
withCredentials: true, // اضافه شده

});
 
// اینترسپتور برای مدیریت پاسخ API
api.interceptors.response.use(
  (response) => {
    // اگر statusCode موجود است و 200 نیست، خطا را نمایش دهد
    if (response.data?.statusCode !== 200) {
      return Promise.reject(new Error(response.data?.message || 'خطایی رخ داده است'));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
 



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
