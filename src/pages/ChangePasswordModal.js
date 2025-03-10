import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import { changePasswordApi } from '../api'; // متد تغییر رمز عبور
import { HelmetProvider, Helmet } from "react-helmet-async";
const ChangePasswordModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (formData.newPassword !== formData.confirmNewPassword) {
      setSnackbar({ open: true, message: 'رمز جدید و تکرار آن یکسان نیستند!', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await changePasswordApi({
        currentPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (response.isSuccess) {
        setSnackbar({ open: true, message: 'رمز عبور با موفقیت تغییر کرد.', severity: 'success' });
        setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        onClose();
      } else {
        setSnackbar({ open: true, message: response.message || 'خطا در تغییر رمز عبور', severity: 'error' });
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'خطا در برقراری ارتباط با سرور', severity: 'error' });
    }
    setLoading(false);
  };

  return (
    <>

      <HelmetProvider>
        <Helmet>
          <title>همسر یابی همسریار</title>

        </Helmet>
      </HelmetProvider>
      <meta
        name="همسریابی"
        content="دوست یابی | همسریابی | همسریار"
      />


      <Modal open={open} onClose={onClose} aria-labelledby="change-password-modal">
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 400,
          bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>تغییر کلمه عبور</Typography>
          <TextField
            label="رمز عبور فعلی"
            name="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="رمز عبور جدید"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="تکرار رمز جدید"
            name="confirmNewPassword"
            type="password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'در حال پردازش...' : 'تغییر رمز عبور'}
          </Button>
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

export default ChangePasswordModal;
