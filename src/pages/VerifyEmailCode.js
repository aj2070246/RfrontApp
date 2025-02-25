import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Snackbar, Alert, Grid, CircularProgress } from '@mui/material';
import { VerifyEmailCodeForAcceptEmail, sendVerifyCodeEmail, getCaptcha } from '../api'; // متد تغییر رمز عبور

const VerifyEmailCode = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    VerifyCode: '',
    captchaId: '',
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
  const sendVerifyCode = async () => {

    setLoading(true);
    try {
      const response = await sendVerifyCodeEmail({
        VerifyCode: formData.VerifyCode,
        captchaId: formData.captchaId,
        captchaValue: formData.captchaValue,
      });

      if (response.isSuccess) {
        setSnackbar({ open: true, message: 'ایمیل شما تایید شد', severity: 'success' });
        setFormData({ VerifyCode: '' });
        onClose();
      } else {
        setSnackbar({ open: true, message: response.message || 'خطا درتایید', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'خطا در برقراری ارتباط با سرور', severity: 'error' });
    }
    setLoading(false);
    fetchCaptcha();
  };

  const handleSubmit = async () => {
    if (formData.VerifyCode == '') {
      setSnackbar({ open: true, message: 'کد اعتبار سنجی را وارد کنید', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await VerifyEmailCodeForAcceptEmail({
        VerifyCode: formData.VerifyCode,
      });

      if (response.isSuccess) {
        setSnackbar({ open: true, message: 'ایمیل شما تایید شد', severity: 'success' });
        setFormData({ VerifyCode: '' });
        onClose();
      } else {
        setSnackbar({ open: true, message: response.message || 'خطا درتایید', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'خطا در برقراری ارتباط با سرور', severity: 'error' });
    }
    setLoading(false);
    fetchCaptcha();
  };

  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="verify-email-modal">
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 400,
          bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>تایید ایمیل</Typography>
          <TextField
            label="کد ارسال شده را وارد نمایید"
            name="VerifyCode"
            value={formData.VerifyCode}
            onChange={handleChange}
            fullWidth
            margin="normal"
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
          <Grid item xs={6}>
            <img src={captcha.image} alt="Captcha" />

          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={sendVerifyCode}
              sx={{
                height: 50,
                backgroundColor: "#ff9800",
                "&:hover": { backgroundColor: "#e68900" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px", // فاصله بین آیکن و متن
              }}
            >
              <Typography fontSize="0.85rem">ارسال مجدد کد </Typography>
            </Button>
          </Grid>
          <br />
          <Grid item xs={6} sm={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{
                height: 50,
                backgroundColor: "#aa9800",
                "&:hover": { backgroundColor: "#e68900" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px", // فاصله بین آیکن و متن
              }}
            >
              <Typography fontSize="0.85rem">تایید ایمیل</Typography>
            </Button>
          </Grid>

        </Box>
      </Modal>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default VerifyEmailCode;
