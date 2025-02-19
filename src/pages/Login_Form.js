import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, Link, CircularProgress } from '@mui/material';
import { getCaptcha, login } from '../api';

const Login_Form = () => {

  const fetchCaptcha = async () => {
    setIsCaptchaLoading(true);
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
  
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(formData); // فرض می‌کنیم تابع login در api.js قرار دارد
    if (response.isSuccess) {
      // ذخیره‌سازی اطلاعات در localStorage
      localStorage.setItem('token', response.model.token);
      // ... می‌توانید سایر مقادیر را نیز ذخیره کنید
    } else {
      setMessage(response.message);
      setFormData(prevData => ({ ...prevData, password: '', captchaValue: '' }));
      fetchCaptcha(); // دریافت کد کپچا جدید
    }
  };

  return (
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
      <Grid item xs={12}>
        <img src={captcha.image} alt="Captcha" />
        {isCaptchaLoading && <CircularProgress />}
        <TextField
          label="کپچا"
          name="captchaValue"
          value={formData.captchaValue}
          onChange={handleChange}
          fullWidth
          required
        />
      </Grid>
      {message && (
        <Grid item xs={12}>
          <Typography color="error">{message}</Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleSubmit}>ورود</Button>
      </Grid>
      <Grid item xs={12}>
        <Link href="/register" variant="body2">ثبت نام</Link>
        <br />
        <Link href="/forgot-password" variant="body2">بازیابی رمز عبور</Link>
      </Grid>
    </Grid>
  );
};

export default Login_Form;
