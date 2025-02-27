import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Snackbar, Alert, Grid, CircularProgress, IconButton } from '@mui/material';
import { VerifyEmailCodeForAcceptEmail, sendVerifyCodeEmail, getCaptcha } from '../api'; // متد تغییر رمز عبور
import CachedIcon from '@mui/icons-material/Cached';
const VerifyEmailCode = ({ open, onClose }) => {
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
        }
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
  };

  const handleSubmit = async () => {
    if (formData.captchaValue.trim() === '') {
      setSnackbar({ open: true, message: 'متن تصویر را وارد کنید', severity: 'error' });
      return;
    }

    if (formData.VerifyCode.trim() === '') {
      setSnackbar({ open: true, message: 'کد اارسال شده به ایمیل تان  را وارد کنید', severity: 'error' });
      return;
    }


    setLoading(true);
    try {

      const response = await VerifyEmailCodeForAcceptEmail({
        data: { // 🔴 اینجا data اضافه شد
          captchaId: captcha.id,
          captchaValue: formData.captchaValue,
          EmailVerifyCodeValue: formData.VerifyCode,
        }
      });


      if (response.isSuccess) {
        setSnackbar({ open: true, message: 'ایمیل شما تایید شد', severity: 'success' });
        setFormData({ VerifyCode: '', captchaValue: '' }); // بازنشانی فرم
        onClose();
      } else {
        setSnackbar({ open: true, message: response.message || 'خطا در تایید', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'خطا در برقراری ارتباط با سرور', severity: 'error' });
    }
    setLoading(false);
    fetchCaptcha(); // بارگذاری کپچا جدید
  };

  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="verify-email-modal">
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
          <Typography variant="h11" gutterBottom> ایمیل حاوی کد اعتبار سنجی برای شما ارسال میشود</Typography>
          <TextField
            label="کد ارسال شده را وارد نمایید"
            name="VerifyCode"
            value={formData.VerifyCode}
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
              <img src={captcha.image} alt="Captcha" />
            </Grid>
            <Grid item>
              <IconButton onClick={fetchCaptcha} color="primary">
                <CachedIcon />
              </IconButton>
            </Grid>
          </Grid>

          {/* Grid container for buttons */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
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
                  gap: "8px",
                }}
              >
                <Typography fontSize="0.85rem"> ارسال مجدد کد تایید </Typography>
              </Button>
            </Grid>
            <Grid item xs={6}>
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
                <Typography fontSize="0.85rem">تایید ایمیل</Typography>
              </Button>
            </Grid>
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
