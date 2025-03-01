import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const defaultAvatar = process.env.PUBLIC_URL + "/pictures/default-avatar.png";
const noAuthRoutes = ['/PublicData/GetCaptcha', '/PublicData/login', '/PublicData/RegisterUser'];

// // لیست آدرس‌ها برای تست به ترتیب
// const baseUrls = [
//   // 'https://api.hamsaryar.com',
//   // 'https://api.hamsaryar.com:443',

//   // 'http://localhost:443',
//   // 'http://209.74.89.215:443',

//   // 'https://localhost:443',
//   // 'https://209.74.89.215:443',
//   // 'https://localhost',
//   // 'https://209.74.89.215',
//   'http://localhost:5000',
//   // 'http://209.74.89.215:5000'
// ];


// لیست آدرس‌ها برای تست به ترتیب
const baseUrls = [
  'https://api.hamsaryar.com',
  'http://localhost:5000',

];
// ایجاد یک نمونه axios بدون baseURL ثابت
const api = axios.create({
  timeout: 10000, // زمان تایم‌اوت
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});


const sendRequest = async (method, url, data = {}) => { // تغییر مقدار پیش‌فرض data
  let lastError = null;
  const currentUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // لیست درخواست‌های امن که نیاز به احراز هویت ندارند
  const trustedActions = ['login', 'getcaptcha', 'registeruser', 'getalldropdownsitems'];

  // بررسی می‌کنیم که آیا درخواست به یکی از `trustedActions` ارسال شده است یا نه
  const isTrustedRequest = trustedActions.some(action => url.toLowerCase().includes(action));

  // اگر درخواست نیاز به احراز هویت داشت و توکن وجود نداشت، کاربر را به صفحه لاگین هدایت کن
  if (!token && !isTrustedRequest) {
    window.location.href = '/login'; // 🚀 حل مشکل useNavigate
    return;
  }

  // تنظیم هدرهای ثابت برای همه درخواست‌ها
  const headers = {
    'Authorization': `Bearer ${token}`,
    'currentUserId': currentUserId,
  };

  console.log('currentUserId', currentUserId);
  console.log('type', method);

  // اگه درخواست POST باشه، `CurrentUserId` رو به دیتا اضافه کن
  if (method.toUpperCase() === 'POST') {
    data.CurrentUserId = currentUserId;
    console.log('type in if', method);
  } else {
    console.log('log : ', method.toUpperCase(), data, typeof data);
  }

  for (const baseUrl of baseUrls) {
    try {
      api.defaults.baseURL = baseUrl;

      const response = await api({
        method: method,
        url: url,
        data: data,
        headers: headers,
      });

      return response;
    } catch (error) {
      console.error(`Error with ${baseUrl}:`, error);

      // **اگر خطای 401 (توکن نامعتبر) دریافت شد، کاربر را به لاگین بفرست**
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token'); // حذف توکن نامعتبر
        localStorage.removeItem('userId'); // حذف یوزر آیدی
        window.location.href = '/login'; // 🚀 حل مشکل useNavigate
        return;
      }

      lastError = error;
    }
  }

  throw new Error(`All attempts failed. Last error: ${lastError}`);
};


// **2** - درخواست گرافیک پروفایل
export const getUserProfilePhoto = async (userId) => {
  try {

    const response = await sendRequest('GET', `/Connection/downloadProfilePhoto/${userId}`,
      { responseType: "blob" }
    );
    return URL.createObjectURL(response.data); // تبدیل پاسخ به یک URL معتبر
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`User photo not found for ${userId}, using default.`);
      return defaultAvatar; // در صورت خطای 404، عکس پیش‌فرض برمی‌گردد
    }
    console.error("Error fetching user photo:", error);
    return defaultAvatar; // برای سایر خطاها هم عکس پیش‌فرض برمی‌گردد
  }
};

// **3** - درخواست آواتار پیش‌فرض
export const getDefaultAvatarAddress = (userId) => {
  return defaultAvatar;
};

// **4** - دریافت همه پیام‌ها
export const getAllMessages = async () => {
  try {
    const response = await sendRequest('POST', '/connection/GetMyAllMessages');
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { isSuccess: false };
  }
};

// **5** - دریافت تصویر پروفایل
export const fetchProfilePicture = async (userId) => {
  try {
    const response = await sendRequest('GET', `/Connection/downloadProfilePhoto/${userId}`);
    return URL.createObjectURL(response.data); // ایجاد URL برای استفاده در `src`
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    return null; // در صورت بروز خطا مقدار null برگردانید
  }
};

// **6** - آپلود تصویر پروفایل
export const uploadProfilePicture = async (file, userId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('currentUserId', userId);

  try {
    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');
    const response = await sendRequest('POST', '/Connection/upload', formData);
    return response.data;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};

// **7** - دریافت گزینه‌های کشویی
export const getDropdownItems = () => {
  return sendRequest('GET', '/PublicData/GetAllDropDownsItems');
};

// **8** - جستجوی کاربران
export const searchUsers = async (requestData) => {
  try {
    const response = await sendRequest('POST', '/Connection/SearchUsers', requestData);
    return response;
  } catch (error) {
    throw new Error('خطا در ارسال درخواست به سرور');
  }
};

// **9** - دریافت پیام‌ها بین دو کاربر
export const getMessages = (senderUserId, receiverUserId) => {
  return sendRequest('POST', '/Connection/GetMessagesWithOneUser', {
    senderUserId,
    receiverUserId
  });
};

// **10** - ارسال پیام جدید
export const sendMessage = (senderUserId, receiverUserId, messageText) => {
  return sendRequest('POST', '/Connection/SendMessage', {
    senderUserId,
    receiverUserId,
    messageText
  });
};

// **11** - بلاک کردن کاربر
export const blockUser = async (inputModel) => {
  try {
    const response = await sendRequest('POST', '/Connection/BlockUserManager', inputModel);
    return response.data;
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    throw error;
  }
};

// **12** - اضافه کردن کاربر به علاقه‌مندی‌ها
export const favoriteUser = async (inputModel) => {
  try {
    const response = await sendRequest('POST', '/Connection/FavoriteUserManager', inputModel);
    return response.data;
  } catch (error) {
    console.error("Error blocking/Favorite user:", error);
    throw error;
  }
};

// **13** - دریافت کپچا
export const getCaptcha = () => sendRequest('GET', '/PublicData/GetCaptcha');

// **14** - ثبت‌نام کاربر
export const registerUser = (formData) => sendRequest('POST', '/PublicData/RegisterUser', formData);

// **15** - آپدیت اطلاعات کاربر
export const UpdateUserInfo = (formData) => sendRequest('POST', '/Connection/UpdateUserInfo', formData);

// **16** - دریافت اطلاعات کاربر
export const getUserInfo = async (stringId, currentuserId) => {
  try {
    const response = await sendRequest('POST', "/Connection/GetUserInfo", { StringId: stringId, CurrentuserId: currentuserId });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};

// **17** - دریافت اطلاعات پروفایل برای ویرایش
export const getMyProfileDataForEdit = async () => {
  try {
    const response = await sendRequest('POST', "/Connection/GetMyProfileInfo");
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};

// **18** - حذف پیام
export const deleteMessage = (stringId) => {
  return sendRequest('POST', '/Connection/deleteMessage', { StringId: stringId });
};

// **19** - تغییر رمز عبور
export const changePasswordApi = async ({ currentPassword, newPassword }) => {
  try {
    const response = await sendRequest('POST', '/Connection/ChangePassword', {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('❌ خطا در تغییر رمز عبور:', error);
    return { isSuccess: false, message: 'خطا در ارتباط با سرور' };
  }
};

// **20** - ارسال ایمیل برای درخواست رمز جدید
export const SendEmailForNewPassword = async ({ data }) => {
  try {
    const response = await sendRequest('POST', '/PublicData/SendEmailForNewPassword', data);
    return response.data;
  } catch (error) {
    console.error('❌ خطا:', error);
    return { isSuccess: false, message: 'خطا در ارتباط با سرور' };
  }
};

// **21** - تایید کد ایمیل برای پذیرش ایمیل
export const VerifyEmailCodeForAcceptEmail = async ({ data }) => {
  try {
    const response = await sendRequest('POST', '/PublicData/VerifyEmailCodeForAcceptEmail', data);
    return response.data;
  } catch (error) {
    console.error('❌ خطا:', error);
    return { isSuccess: false, message: 'خطا در ارتباط با سرور' };
  }
};

// **22** - ارسال کد تایید ایمیل
export const sendVerifyCodeEmail = async ({ data }) => {
  try {
    const response = await sendRequest('POST', '/PublicData/SendEmailVerifyCodeForVerify', data);
    return response.data;
  } catch (error) {
    console.error('❌ خطا:', error);
    return { isSuccess: false, message: 'خطا در ارتباط با سرور' };
  }
};

// **23** - ورود به سیستم
export const login = async (formData) => {
  try {
    const response = await sendRequest('POST', '/PublicData/login', formData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    return { isSuccess: false, message: "خطایی در ورود به سیستم رخ داده است." };
  }
};

// **24** - دریافت لیست کاربرانی که من را بلاک کرده‌اند
export const BlockedMeUsersApi = async () => {
  try {
    const response = await sendRequest('POST', "/Connection/getBlockedMeUsers", { CurrentuserId: localStorage.getItem('userId') });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};

// **25** - دریافت لیست کاربرانی که من آن‌ها را بلاک کرده‌ام
export const BlockedUsersApi = async () => {
  try {
    const response = await sendRequest('POST', "/Connection/getBlockedUsers", { CurrentuserId: localStorage.getItem('userId') });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};

// **26** - دریافت لیست کاربران مورد علاقه من
export const FavoritedMeUsersApi = async () => {
  try {
    const response = await sendRequest('POST', "/Connection/getFavoritedMeUsers", { CurrentuserId: localStorage.getItem('userId') });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};

// **27** - دریافت لیست کاربران مورد علاقه من
export const FavoriteUsersApi = async () => {
  try {
    const response = await sendRequest('POST', "/Connection/getFavoriteUsers", { CurrentuserId: localStorage.getItem('userId') });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};

// **28** چه کسانی پروفایل من را چک کرده اند ؟

export const LastUsersCheckedMeApi = async () => {
  try {
    const response = await sendRequest("/Connection/LastUsersCheckedMe", {
      CurrentuserId: localStorage.getItem('userId')

    });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};