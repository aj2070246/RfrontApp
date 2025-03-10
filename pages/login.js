import Head from 'next/head';
import Link from 'next/link'; // وارد کردن Link از next/link

import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Typography, Grid, CircularProgress } from '@mui/material';
import { getCaptcha, login, getDropdownItems } from './api';
import { Container, Paper, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router';  // استفاده از useRouter

const Login_Form = () => {

  const fetchCaptcha = async () => {
    try {
      const captchaResponse = await getCaptcha();
      if (captchaResponse.data && captchaResponse.data.guid && captchaResponse.data.image) {
        setCaptcha({ id: captchaResponse.data.guid, image: captchaResponse.data.image });
        setFormData(prevData => ({
          ...prevData,
          captchaId: captchaResponse.data.guid
        }));
      }
    } catch (error) {
      console.error('❌ Error fetching captcha:', error);
    } finally {
      setIsCaptchaLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    captchaId: '',
    captchaValue: ''
  });
  const [captcha, setCaptcha] = useState({ id: null, image: '' });
  const [iframeHeight, setIframeHeight] = useState(400); // ارتفاع پیش‌فرض 400
  const iframeRef = useRef(null);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hasError, setHasError] = useState(false); // کنترل وضعیت خطا

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "SET_IFRAME_HEIGHT") {
        setIframeHeight(event.data.height); // تنظیم ارتفاع از پیام
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (hasError) return; // اگر قبلاً خطا رخ داده، از اجرای مجدد جلوگیری کن
    // try {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('userId');
    // } catch (error) {

    // }
    setIsCaptchaLoading(true);

    const fetchData = async () => {
      try {
        const drop = await getDropdownItems();
        await fetchCaptcha();
      }
      catch (error) {
        console.error('❌ خطایی رخ داده است:', error);
        setHasError(true); // در صورت بروز خطا، اجرای مجدد متوقف می‌شود
      }
    };

    fetchData();
  }, [hasError]); // این تابع فقط زمانی اجرا می‌شود که hasError مقدار false داشته باشد.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const refreshCaptcha = async () => {
    await fetchCaptcha();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(formData); // فرض می‌کنیم تابع login در api.js قرار دارد
    if (response.isSuccess) {
      // ذخیره‌سازی اطلاعات در localStorage
      localStorage.setItem('token', response.model.token);
      localStorage.setItem('userId', response.model.id);
      localStorage.setItem('gender', response.model.gender);
      localStorage.setItem('genderId', response.model.genderId);
      localStorage.setItem('firstName', response.model.firstName);
      router.push('/search') // ... می‌توانید سایر مقادیر را نیز ذخیره کنید
    } else {
      setMessage(response.message);
      setFormData(prevData => ({ ...prevData, password: '', captchaValue: '' }));
      fetchCaptcha(); // دریافت کد کپچا جدید
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <meta
          name="همسریابی"
          content="دوست یابی | همسریابی | همسریار"
        />
        <Head>
          <title>همسر یابی همسریار</title>
        </Head>

        <div className="banner2">
          <p className="banner-text2"> <h1>  همسریار </h1> </p>
          <p className="banner-text2">  سامانه همسریابی </p>
          <p className="banner-text2">  سامانه  دوست یابی</p>
        </div>


        <Grid container spacing={2} className="login-form">
          <Grid item xs={12}>
            <Typography variant="h4">ورود به حساب کاربری</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="نام کاربری"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="رمز عبور"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <img src={captcha.image} alt="همسریابی | دوستیابی | همسریار" />
          </Grid>
          <Grid item xs={6}>
            <Button variant="outlined" onClick={refreshCaptcha}>🔄 دریافت مجدد</Button>
          </Grid>

          {isCaptchaLoading && <CircularProgress />}
          <TextField
            label="کپچا"
            name="captchaValue"
            value={formData.captchaValue}
            onChange={handleChange}
            fullWidth
            required
          />
          {message && (
            <Grid item xs={12}>
              <Typography color="error">{message}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>ورود</Button>
          </Grid>
          <Grid item xs={12}>
            {/* <Link legacyBehavior href="/registerForm" passHref>
              <Typography variant="body2">ثبت نام</Typography>
            </Link>
            <br />
            <Link legacyBehavior href="/ForgatePassword" passHref>
              <Typography variant="body2">بازیابی رمز عبور</Typography>
            </Link> */}
          </Grid>
        </Grid>

        {/* اضافه کردن iframe برای نمایش صفحه Search */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            کاربران همسریابی همسریار
          </Typography>
          <iframe
            src="/search"
            title="Search Page Preview"
            width="100%"
            height={iframeHeight} // استفاده از state برای ارتفاع
            style={{ border: '1px solid #ccc', borderRadius: '4px' }}
            allowFullScreen
          />
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login_Form;