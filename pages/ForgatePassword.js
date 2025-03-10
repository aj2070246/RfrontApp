import Head from 'next/head';

import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Snackbar, Alert, Grid, CircularProgress, IconButton, Card } from '@mui/material';
import { SendEmailForNewPassword, sendVerifyCodeEmail, getCaptcha } from './api'; // متد تغییر رمز عبور
import CachedIcon from '@mui/icons-material/Cached';
const ForgatePassword = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    VerifyCode: '',
    guid: '',
    captchaValue: ''
  });



  useEffect(() => {
    fetchCaptcha();
  }, []);
  const [captcha, setCaptcha] = useState({ id: null, image: '' });

  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  const fetchCaptcha = async () => {
    setIsCaptchaLoading(true);
    try {
      const captchaResponse = await getCaptcha();
      if (captchaResponse.data && captchaResponse.data.guid && captchaResponse.data.image) {
        setCaptcha({ id: captchaResponse.data.guid, image: captchaResponse.data.image });
        setFormData({ VerifyCode: '', captchaValue: '', captchaId: '', guid: '' }); // بازنشانی تمام فیلدها


      }
    } catch (error) {
      console.error('❌ Error fetching captcha:', error);
    } finally {
      setIsCaptchaLoading(false);
    }
  };
  const sendVerifyCode = async (isLoad) => {
    if (formData.captchaValue.trim() === '') {
      setSnackbar({ open: true, message: 'متن تصویر را وارد کنید', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await sendVerifyCodeEmail({
        data: {
          captchaId: formData.captchaId,
          captchaValue: formData.captchaValue,
          emailAddress: formData.emailAddress
        }
      });

      if (response.isSuccess) {
        setSnackbar({ open: true, message: 'رمز عبور جدید برای شما ارسال شد', severity: 'success' });
        setFormData({ VerifyCode: '' });
        onClose();
      } else {
        setSnackbar({ open: true, message: response.message || 'خطا درتایید', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'خطا در در برقراری ارتباط با سرور', severity: 'error' });
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.captchaValue || formData.captchaValue.trim() === '') {

      setSnackbar({ open: true, message: 'متن تصویر را وارد کنید', severity: 'error' });
      return;
    }
    if (!formData.emailAddress || formData.emailAddress.trim() === '') {

      setSnackbar({ open: true, message: 'ایمیل تان  را وارد کنید', severity: 'error' });
      return;
    }


    setLoading(true);
    try {

      const response = await SendEmailForNewPassword({
        data: { // 🔴 اینجا data اضافه شد
          captchaId: captcha.id,
          captchaValue: formData.captchaValue,
          emailAddress: formData.emailAddress,
        }
      });


      if (response.model) {
        setSnackbar({ open: true, message: 'رمز عبور جدید برای شما ایمیل شد', severity: 'success' });
        setFormData({ emailAddress: '', captchaValue: '' }); // بازنشانی فرم
      } else {
        setSnackbar({ open: true, message: response.message || 'خطا در تایید', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'خطا دردردر برقراری ارتباط با سرور', severity: 'error' });
    }
    setLoading(false);
    fetchCaptcha(); // بارگذاری کپچا جدید
  };

  return (
    <>
      <meta
        name="همسریابی"
        content="دوست یابی | همسریابی | همسریار"
      />
      <Head>
        <title>همسر یابی همسریار</title>
      </Head>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center", // برای وسط چین کردن عمودی
          height: "100vh", // ارتفاع کامل صفحه
          mt: 5,
        }}
      >

        <Card sx={{ maxWidth: 500, p: 3, borderRadius: "12px", boxShadow: 3 }}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >


            <div class="banner2">
              <p class="banner-text2"> <h1>  همسریار </h1> </p>
              <p class="banner-text2"> <h3>  فراموشی رمز عبور </h3> </p>
              <p class="banner-text2">  سامانه  همسریابی همسریار </p>
            </div>

            <HelmetProvider>
              <Helmet>
                <title>همسر یابی همسریار</title>

              </Helmet>
            </HelmetProvider>
            <Typography variant="h11" gutterBottom> لطفا ایمیل خود را وارد نمایید تا رمز عبور جدید برای شما ارسال شود</Typography>
            <TextField
              label="ایمیل خود را وارد نمایید"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />

            {isCaptchaLoading && <CircularProgress />}
            <TextField
              label="متن داخل تصویر را وارد کنید"
              name="captchaValue"
              value={formData.captchaValue}
              onChange={handleChange}
              fullWidth
              required
            />
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <img src={captcha.image} alt="همسریابی | دوستیابی | همسریار" />
              </Grid>
              <Grid item>
                <IconButton onClick={fetchCaptcha} color="primary">
                  <CachedIcon />
                </IconButton>
              </Grid>
            </Grid>

            {/* Grid container for buttons */}
            <Grid container spacing={2} sx={{ mt: 2 }}>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                  sx={{
                    height: 50,
                    backgroundColor: "green",
                    "&:hover": { backgroundColor: "#green" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Typography fontSize="0.85rem">ارسال کلمه عبور جدید به ایمیل</Typography>
                </Button>
              </Grid>
            </Grid>

          </Box>
        </Card>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ForgatePassword;
