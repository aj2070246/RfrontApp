
import axios from 'axios';

// ایجاد یک نمونه axios با آدرس پایه
const api = axios.create({
  baseURL: 'http://127.0.0.1:5207', // آدرس پایه API
  // baseURL: 'http://93.118.140.133:2060', // آدرس پایه API
  timeout: 10000, // زمان تایم‌اوت برای درخواست‌ها
  headers: {
    'accept': 'application/json',   'Content-Type': 'application/json',
  
}, 

});

export const getDropdownItems = () => {
console.log('api called => GetAllDropDownsItems 12');
// return api.get('/AccountCountroller/testGet');
return api.get('/PublicData/GetAllDropDownsItems');
};


// این متد برای ارسال درخواست جستجو به آدرس /x/search است

export const searchUsers = async (requestData) => {
  try {
    // ارسال درخواست POST به سرور
    const response = await api.post('/Connection/SearchUsers', requestData);
    return response; // برگشت نتیجه
  } catch (error) {
    throw new Error('خطا در ارسال درخواست به سرور');
  }
};


// دریافت پیام‌های بین دو کاربر
export const getMessages = (senderUserId, receiverUserId) => {
  return api.post('/Connection/GetMessagesWithOneUser', {
    senderUserId,
    receiverUserId
  });
};

// ارسال پیام جدید
export const sendMessage = (senderUserId, receiverUserId, messageText) => {
  return api.post('/Connection/SendMessage', {
    senderUserId,
    receiverUserId,
    messageText
  });
};



export const getCaptcha = () => api.get('/PublicData/GetCaptcha');

export const registerUser = (formData) => api.post('/PublicData/RegisterUser', formData);

export const getUserInfo = (stringId) => {
  return api.post('/Connection/GetUserInfo', { StringId: stringId });
};

export const deleteMessage = (stringId) => {
console.log('deleteMessage=>   2' + stringId);
return api.post('/Connection/deleteMessage', { StringId: stringId });
};
