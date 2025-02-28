import axios from 'axios';

const defaultAvatar = process.env.PUBLIC_URL + "/pictures/default-avatar.png";
const noAuthRoutes = ['/PublicData/GetCaptcha', '/PublicData/login', '/PublicData/RegisterUser'];

// لیست آدرس‌ها برای تست به ترتیب
const baseUrls = [
  'https://api.mySite.com',
  'https://api.mySite.com:443',
  
  'http://localhost:443',
  'http://5.223.41.164:443',

  'https://localhost:443',
  'https://5.223.41.164:443',
  'https://localhost',
  'https://5.223.41.164',
  'http://localhost:5000',
  'http://5.223.41.164:5000'
];

// ایجاد یک نمونه axios بدون baseURL ثابت
const api = axios.create({
  timeout: 10000, // زمان تایم‌اوت
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// تابع sendRequest با چک کردن آدرس‌ها به ترتیب
const sendRequest = async (method, url, data = null) => {
  let lastError = null;

  // حلقه برای تست هر آدرس
  for (const baseUrl of baseUrls) {
    try {
      // تنظیم baseURL برای این درخواست
      api.defaults.baseURL = baseUrl;

      // ارسال درخواست
      const response = await api({
        method: method,
        url: url, // url اینجا فقط مسیر (مثل /connection/GetMyAllMessages) هست
        data: data,
      });

      // اگه موفق شد، پاسخ رو برگردون
      return response;
    } catch (error) {
      console.error(`Error with ${baseUrl}:`, error);
      lastError = error; // ذخیره آخرین خطا
    }
  }

  // اگه هیچ آدرسی کار نکرد، خطا برگردون
  throw new Error(`All attempts failed. Last error: ${lastError}`);
};

// **2** - درخواست گرافیک پروفایل
export const getUserProfilePhoto = async (userId) => {
  
  let lastError = null;

  // حلقه برای چک کردن هر آدرس به ترتیب
  for (const baseUrl of baseUrls) {
    try {
      // ایجاد URL کامل با آدرس پایه جدید
      const result = `${baseUrl}/connection/downloadProfilePhoto?userId=${userId}`;

      // ارسال درخواست به آدرس جدید
      const response = await axios.get(result);

      // در صورتی که پاسخ دریافت شود، عکس کاربر را باز می‌گرداند
      return response.data;
    } catch (error) {
      console.error(`Error with ${baseUrl}:`, error);
      lastError = error; // ذخیره آخرین خطا برای لاگ
    }
  }

  // اگر هیچ‌کدام از آدرس‌ها پاسخ ندادند
  throw new Error(`All attempts failed. Last error: ${lastError}`);
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