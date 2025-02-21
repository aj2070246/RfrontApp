import axios from 'axios';

// ایجاد نمونه axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000', // آدرس API
  timeout: 10000, // زمان تایم‌اوت
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// لیست مسیرهایی که نیاز به توکن ندارند
const noAuthRoutes = ['/PublicData/GetCaptcha', '/PublicData/login', '/PublicData/RegisterUser'];

// **بررسی مقدار توکن در هر درخواست**
api.interceptors.request.use(
  (config) => {
    // بررسی اینکه آیا این درخواست در لیست noAuthRoutes قرار دارد یا نه
    if (!noAuthRoutes.includes(config.url)) {
      const token = localStorage.getItem('token'); // دریافت توکن
      const currentUserId = localStorage.getItem('userId'); // دریافت توکن
      if (!token && window.location.pathname !== '/registerForm') {
        window.location.href = '/login'; 
        return Promise.reject('No token found');
      }
      config.headers['token'] = `Bearer ${token}`;
      config.headers['currentUserId'] = currentUserId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// **بررسی مقدار statusCode در هر پاسخ**
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


export const uploadProfilePicture = async (file, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    try {
        const response = await api.post('/Connection/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // پاسخ سرور را برگردانید
    } catch (error) {
        console.error('There was an error uploading the file!', error);
        throw error; // خطا را پرتاب کنید
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



export const getCaptcha = () => api.get('/PublicData/GetCaptcha');

export const registerUser = (formData) => api.post('/PublicData/RegisterUser', formData);

export const getUserInfo = async (stringId) => {
  try {
    const response = await api.post("/Connection/GetUserInfo", { StringId: stringId });
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




export const login = async (formData) => {
  try {
    const response = await api.post('/PublicData/login', formData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    return { isSuccess: false, message: "خطایی در ورود به سیستم رخ داده است." };
  }
};




