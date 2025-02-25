import axios from 'axios';
const baseAddressApi = 'http://localhost:5000';
const defaultAvatar = process.env.PUBLIC_URL + "/pictures/default-avatar.png";
const noAuthRoutes = ['/PublicData/GetCaptcha', '/PublicData/login', '/PublicData/RegisterUser'];

const api = axios.create({
  baseURL: baseAddressApi,
  timeout: 10000, // زمان تایم‌اوت
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // بررسی اینکه آیا این درخواست در لیست noAuthRoutes قرار دارد یا نه
    if (!noAuthRoutes.includes(config.url)) {
      const token = localStorage.getItem('token'); // دریافت توکن
      const currentUserId = localStorage.getItem('userId');
      if (!token && window.location.pathname !== '/registerForm') {
        window.location.href = '/login';
        return Promise.reject('No token found');
      }
      config.headers['token'] = `Bearer ${token}`;
      config.headers['currentUserId'] = currentUserId;
    }
    if (config.method === 'post') {
      config.data = {
        ...config.data,
        currentUserId: localStorage.getItem('userId'),
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {

    // **اگر statusCode = 999 بود و جزو لیست نبود، ریدایرکت شود**
    if (response.data.statusCode === 999 && !noAuthRoutes.includes(response.config.url)) {
      window.location.href = "/login";
    }

    return response;
  },
  (error) => {
    // **مدیریت خطای 401 Unauthorized**
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized! Redirecting to login...");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


export default api;

export const getUserProfilePhoto = (userId) => {
  const result = `${baseAddressApi}/connection/downloadProfilePhoto?userId=${userId}`;

  console.log(result);
  return result;
};

export const getDefaultAvatarAddress = (userId) => {

  console.log(defaultAvatar);
  return defaultAvatar;
};

export const getAllMessages = async () => {
  try {
    const response = await api.post('/connection/GetMyAllMessages', {
      // هر داده‌ای که نیاز دارید در اینجا بفرستید
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { isSuccess: false };
  }
};


export const fetchProfilePicture = async (userId) => {
  try {
    const response = await api.get(`/Connection/downloadProfilePhoto/${userId}`, {
      responseType: 'blob', // دریافت داده به‌صورت فایل
    });

    return URL.createObjectURL(response.data); // ایجاد URL برای استفاده در `src`
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    return null; // در صورت بروز خطا مقدار null برگردانید
  }
};

///////////////////////
export const uploadProfilePicture = async (file, userId) => {
  const api2 = axios.create({
    baseURL: baseAddressApi,
    timeout: 10000,
  });

  const token = localStorage.getItem('token'); // دریافت توکن
  const currentUserId = localStorage.getItem('userId');

  if (!token && window.location.pathname !== '/registerForm') {
    window.location.href = '/login';
    return Promise.reject('No token found');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('currentUserId', userId); // مطمئن شو که سرور `currentUserId` رو قبول می‌کنه

  console.log('✅ Sending API request with:', formData);

  try {
    const response = await api2.post('/Connection/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,  // فیلد توکن رو تصحیح کن
        'currentUserId': currentUserId, // اضافه کردن userId به هدر (اگر لازم باشه)
      },
    });

    console.log('✅ Upload success:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};

export const getDropdownItems = () => {
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


export const blockUser = async (inputModel) => {
  try {
    const response = await api.post('/Connection/BlockUserManager', inputModel); // مسیر صحیح API را وارد کنید
    return response.data; // یا return response بسته به ساختار پاسخ شما
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    throw error; // در صورت نیاز می‌توانید خطا را پرتاب کنید
  }
};


export const favoriteUser = async (inputModel) => {
  try {
    const response = await api.post('/Connection/FavoriteUserManager', inputModel); // مسیر صحیح API را وارد کنید
    return response.data; // یا return response بسته به ساختار پاسخ شما
  } catch (error) {
    console.error("Error blocking/Favorite user:", error);
    throw error; // در صورت نیاز می‌توانید خطا را پرتاب کنید
  }
};
export const getCaptcha = () => api.get('/PublicData/GetCaptcha');

export const registerUser = (formData) => api.post('/PublicData/RegisterUser', formData);
export const UpdateUserInfo = (formData) => api.post('/Connection/UpdateUserInfo', formData);

export const getUserInfo = async (stringId, currentuserId) => {
  try {
    const response = await api.post("/Connection/GetUserInfo", { StringId: stringId, CurrentuserId: currentuserId });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};

export const getMyProfileDataForEdit = async (currentuserId) => {
  try {
    const response = await api.post("/Connection/GetMyProfileInfo", { CurrentUserId: currentuserId });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};



export const deleteMessage = (stringId) => {
  console.log('deleteMessage=>   2' + stringId);
  return api.post('/Connection/deleteMessage', { StringId: stringId });
};


export const changePasswordApi = async ({ currentPassword, newPassword }) => {
  try {
    const response = await api.post('/Connection/ChangePassword', {
      currentPassword,
      newPassword
    });

    return response.data; // انتظار می‌رود که شامل isSuccess و message باشد
  } catch (error) {
    console.error('❌ خطا در تغییر رمز عبور:', error);
    return { isSuccess: false, message: 'خطا در ارتباط با سرور' };
  }
};




export const login = async (formData) => {
  try {
    const response = await api.post('/PublicData/login', formData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    return { isSuccess: false, message: "خطایی در ورود به سیستم رخ داده است." };
  }
};




export const BlockedMeUsersApi = async () => {
  try {
    const response = await api.post("/Connection/getBlockedMeUsers", {
      CurrentuserId: localStorage.getItem('userId')
    });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};
export const BlockedUsersApi = async () => {
  try {
    const response = await api.post("/Connection/getBlockedUsers", {
      CurrentuserId: localStorage.getItem('userId')
    });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};
export const FavoritedMeUsersApi = async () => {
  try {
    const response = await api.post("/Connection/getFavoritedMeUsers", {
      CurrentuserId: localStorage.getItem('userId')
    });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};
export const FavoriteUsersApi = async () => {
  try {
    const response = await api.post("/Connection/getFavoriteUsers", {
      CurrentuserId: localStorage.getItem('userId')
    });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};
export const LastUsersCheckedMeApi = async () => {
  try {
    const response = await api.post("/Connection/LastUsersCheckedMe", {
      CurrentuserId: localStorage.getItem('userId')

    });
    return response.data;
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return null;
  }
};