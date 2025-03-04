import { HelmetProvider, Helmet } from "react-helmet-async";
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, Link, CircularProgress } from '@mui/material';
import { getCaptcha, login, getDropdownItems, isDevelopMode, hamYab, hamYar, doostYab, hamType } from '../api';
import { Container, Paper, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login_Form = () => {
  const navigate = useNavigate();

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

  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hasError, setHasError] = useState(false); // کنترل وضعیت خطا

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
      localStorage.setItem('lastName', response.model.lastName);
      navigate('/search'); // اینجا صفحه مورد نظر را مشخص کنید
      // ... می‌توانید سایر مقادیر را نیز ذخیره کنید
    } else {
      setMessage(response.message);
      setFormData(prevData => ({ ...prevData, password: '', captchaValue: '' }));
      fetchCaptcha(); // دریافت کد کپچا جدید
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {!isDevelopMode() && (
          <>
            <div className="banner2">
              <p className="banner-text2"> <h1>  {hamYar()} </h1> </p>
              <p className="banner-text2">  سامانه {hamYab()} {hamType()} </p>
              <p className="banner-text2">  سامانه {doostYab()}</p>
            </div>
            <HelmetProvider>
              <Helmet>
                <title>{hamYab()} | {hamYar()}</title>
              </Helmet>
            </HelmetProvider>
          </>
        )}

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
            <img src={captcha.image} alt="Captcha" />
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
            <Link href="/registerForm" variant="body2">ثبت نام</Link>
            <br />
            <Link href="/ForgatePassword" variant="body2">بازیابی رمز عبور</Link>
          </Grid>
        </Grid>

        {/* اضافه کردن iframe برای نمایش صفحه Search */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
            کاربران {hamYab()} {hamYar()}
          </Typography>
          <iframe
            src="/search"
            title="Search Page Preview"
            width="100%"
            height="400px"
            style={{ border: '1px solid #ccc', borderRadius: '4px' }}
            allowFullScreen
          />
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login_Form;