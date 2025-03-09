import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const defaultAvatarMan = process.env.PUBLIC_URL + "/pictures/default-avatar-man.png";
const defaultAvatarNone = process.env.PUBLIC_URL + "/pictures/default-avatar.png";
const defaultAvatarWoman = process.env.PUBLIC_URL + "/pictures/default-avatar-woman.png";
export const isDevelopMode = () => { return false };
export const hamYar = () => {
  if (!isDevelopMode())
    return "همسریار"
  return "تستیار";

};

export const hamYab = () => {
  if (!isDevelopMode())
    return "همسریابی"
  return "تستیاب";
};
export const hamType = () => {
  if (!isDevelopMode())
    return "موقت و دائم"
  return "تستیاب";
};

export const doostYab = () => {
  if (!isDevelopMode())
    return "دوستیابی"
  return "دوستیاب";
};


// لیست آدرس‌ها برای تست به ترتیب
const baseUrls = [
  // 'https://api.hamsaryar.com'
  'http://localhost:5000',
  // 'https://api.hamsaryar.com',

];
// ایجاد یک نمونه axios بدون baseURL ثابت
const api = axios.create({
  timeout: 100000, // زمان تایم‌اوت
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});


const sendRequest = async (method, url, data = {}, isFormData = false, config = {}) => { // تغییر مقدار پیش‌فرض data
  let lastError = null;
  const currentUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // لیست درخواست‌های امن که نیاز به احراز هویت ندارند
  const trustedActions = ['login', 'getcaptcha', 'registeruser', 'getalldropdownsitems',
    'searchusers', 'downloadprofilephoto','sendemailfornewpassword'];
  console.log(url);
  // بررسی می‌کنیم که آیا درخواست به یکی از `trustedActions` ارسال شده است یا نه
  const isTrustedRequest = trustedActions.some(action => url.toLowerCase().includes(action));
  // اگر درخواست نیاز به احراز هویت داشت و توکن وجود نداشت، کاربر را به صفحه لاگین هدایت کن
  if (!token && !isTrustedRequest) {
    console.log('urlurlurlurlurlurl', url)
    debugger;
    window.location.href = '/login'; // 🚀 حل مشکل useNavigate
    return;
  }

  // تنظیم هدرهای ثابت برای همه درخواست‌ها
  const headers = {
    'token': `Bearer ${token}`,
    'currentUserId': currentUserId,
  };
  if (isFormData) {
    headers['Content-Type'] = 'multipart/form-data';
  } else {
    headers['Content-Type'] = 'application/json';
  }


  // اگه درخواست POST باشه، `CurrentUserId` رو به دیتا اضافه کن
  if (method.toUpperCase() === 'POST') {
    data.CurrentUserId = currentUserId;
  } else {
  }

  for (const baseUrl of baseUrls) {
    try {
      api.defaults.baseURL = baseUrl;

      const response = await api({
        method: method,
        url: url,
        data: data,
        headers: headers,
        responseType: config.responseType || 'json', // مقدار پیش‌فرض json
      });

      return response;
    } catch (error) {
      console.error(`Error with ${baseUrl}:`, error);

      // **اگر خطای 401 (توکن نامعتبر) دریافت شد، کاربر را به لاگین بفرست**
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token'); // حذف توکن نامعتبر
        localStorage.removeItem('userId'); // حذف یوزر آیدی
        debugger;
        window.location.href = '/login'; // 🚀 حل مشکل useNavigate
        return;
      }

      lastError = error;
    }
  }

  throw new Error(`All attempts failed. Last error: ${lastError}`);
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
export const getUserProfilePhoto = async (userId = '', genderId = 3) => {
  try {
    if (userId == '' || userId === '') {
      userId = localStorage.getItem('userId')
    }
    const response = await sendRequest(
      'GET',
      `/Connection/downloadProfilePhoto?userId=${userId}`,
      {}, // داده خالی
      false, // isFormData
      { responseType: 'blob' } // تنظیمات اضافی
    );


    // چک کن که response.data واقعاً Blob باشه
    if (!(response.data instanceof Blob)) {
      console.log('Response is not a Blob');
      throw new Error('Response is not a Blob');
    }
    console.log('createObjectURL', response.data);
    const result = URL.createObjectURL(response.data)
    console.log('result', result);
    if (result === 'undefined') {
      throw new Error('Response is not a BlobBlobBlob');
    }
    return result;

  } catch (error) {
    console.error("Error fetching user photo:", error);
    if (genderId == 1)
      return defaultAvatarMan; // عکس پیش‌فرض در صورت خطا
    if (genderId == 2)
      return defaultAvatarWoman; // عکس پیش‌فرض در صورت خطا
    return defaultAvatarNone; // عکس پیش‌فرض در صورت خطا
  }
};
export const uploadProfilePicture = async (formData) => {
  if (!(formData instanceof FormData)) {
    console.error('❌ Error: formData is not an instance of FormData!');
    throw new Error('Invalid formData');
  }

  try {
    const response = await sendRequest('POST', '/Connection/upload', formData, true);
    return response.data;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};

// **3** - درخواست آواتار پیش‌فرض
export const getDefaultAvatarAddress = (genderId) => {
  console.log('getDefaultAvatarAddress=>', genderId);

  if (genderId == 1)
    return defaultAvatarMan;

  if (genderId == 2)
    return defaultAvatarWoman;

  if (genderId == 3 || genderId == 0)
    return defaultAvatarNone;
};



// **5** - دریافت تصویر پروفایل
export const fetchProfilePicture = async (userId) => {
  try {
    const response = await sendRequest('GET', `/Connection/downloadProfilePhoto?userId=${userId}`);
    return URL.createObjectURL(response.data); // ایجاد URL برای استفاده در `src`
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    return null; // در صورت بروز خطا مقدار null برگردانید
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
export const GetCountOfUnreadMessages = () => {
  return sendRequest('POST', '/Connection/GetCountOfUnreadMessages', {}
  );
};


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

export const SendReport = async (userId) => {
  try {
    debugger;
    const response = await sendRequest('POST', '/Connection/SendReport', {
      ReportedUserId:userId
    });
    return response.data;
  } catch (error) {
    console.error("Error reporting user:", error);
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
export const getUserInfo = async (stringId, currentuserId = "") => {
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
  console.log('LastUsersCheckedMeApiLastUsersCheckedMeApiLastUsersCheckedMeApi')
  try {
    const response = await sendRequest('POST', "/Connection/LastUsersCheckedMe", {
      CurrentuserId: localStorage.getItem('userId')

    });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};