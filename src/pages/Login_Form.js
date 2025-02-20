import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, Link, CircularProgress } from '@mui/material';
import { getCaptcha, login } from '../api';
import {   Container, Paper,  Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login_Form = () => {

const navigate = useNavigate();

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

  const refreshCaptcha = async () => {
    await fetchCaptcha();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(formData); // فرض می‌کنیم تابع login در api.js قرار دارد
    if (response.isSuccess) {
      // ذخیره‌سازی اطلاعات در localStorage
      localStorage.setItem('amirToken', response.model.token);
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
        <Link href="/register" variant="body2">ثبت نام</Link>
        <br />
        <Link href="/forgot-password" variant="body2">بازیابی رمز عبور</Link>
      </Grid>
    </Grid>
    </Paper>
    </Container>
  );
};

export default Login_Form;
