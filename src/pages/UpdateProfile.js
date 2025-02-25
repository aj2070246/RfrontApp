import React, { useState, useEffect } from 'react';
import { Grid, Button, Container, Paper, TextField, Snackbar, Alert } from '@mui/material';
import { getCaptcha, getMyProfileDataForEdit, getDropdownItems } from '../api'; // Import necessary API functions
import {
  GenderDropdown,
  ProvinceDropdown,
  HealtStatusDropdown,
  LiveTypeDropdown,
  MarriageStatusDropdown,
  CarValuesDropdown,
  HomeValueDropDown,
  IncomeAmountDropDown,
  RelationTypeDropDown
} from './registerPage/Dropdowns';
import BirthdaySelector from './registerPage/BirthdaySelector';
import ChangePasswordModal from './ChangePasswordModal';

const UpdateProfile = () => {
  const [captcha, setCaptcha] = useState({ id: null, image: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(true);
  const [dropdownData, setDropdownData] = useState({
    genders: [],
    healtStatus: [],
    liveTypes: [],
    marriageStatus: [],
    provinces: [],
    incomeAmount: [],
    homeValue: [],
    carValue: [],
    relationType: [],
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    mobile: '',
    captchaValue: '',
    captchaId: null,
    province: '',
    healtStatus: '',
    liveType: '',
    marriageStatus: '',
    rDescription: '',
    myDescription: '',
    birthDate: '',
    emailAddress: '',
    incomeAmount: '',
    homeValue: '',
    carValue: '',
    relationType: '',
  });
  const [results, setResults] = useState([]); // مقدار پیش‌فرض آرایه خالی
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [currentUserId, setCurrentUserId] = useState(null); // To hold the current user's ID
  const [loading, setLoading] = useState(false); // For loading state

  useEffect(() => {
    setCurrentUserId(localStorage.getItem('userId')); // Get user ID from local storage
    const fetchUserData = async () => {
      setLoading(true);
      const response = await getMyProfileDataForEdit(currentUserId); // Fetch user info from API

      if (response && response.model) {
        setFormData(response.model); // مقداردهی فقط در صورت معتبر بودن داده
      } else {
        console.error("❌ دریافت اطلاعات کاربر ناموفق بود یا داده‌ها خالی هستند.");
        setFormData({}); // جلوگیری از کرش با مقداردهی پیش‌فرض
      }
      setLoading(false);
    };

    fetchUserData();
  }, [currentUserId]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const dropdownResponse = await getDropdownItems();
        if (dropdownResponse.data.isSuccess) {
          setDropdownData({
            genders: dropdownResponse.data.model.genders || [],
            healtStatus: dropdownResponse.data.model.healtStatus || [],
            liveTypes: dropdownResponse.data.model.liveTypes || [],
            marriageStatus: dropdownResponse.data.model.marriageStatus || [],
            provinces: dropdownResponse.data.model.provinces || [],
            incomeAmount: dropdownResponse.data.model.incomeAmount || [],
            carValue: dropdownResponse.data.model.carValue || [],
            homeValue: dropdownResponse.data.model.homeValue || [],
            relationType: dropdownResponse.data.model.relationType || [],
          });
        }
      } catch (error) {
        console.error('❌ Error fetching dropdown data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can handle the submit action for the edited profile
  };


  if (loading || isLoading) {
    return <div>⏳ لطفاً صبر کنید، در حال بارگیری اطلاعات...</div>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          {/* <div className="banner2">
            <p className="banner-text2">برای ویرایش اطلاعات کاربری خود</p>
            <p className="banner-text2">لطفاً اطلاعات زیر را تکمیل کنید</p>
          </div> */}

          <Grid container spacing={2}>
            <TextField label="نام" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth />
            <TextField label="نام خانوادگی" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth />
            <TextField label="نام کاربری" name="userName" value={formData.userName} onChange={handleChange} fullWidth />
            <TextField label="شماره موبایل" name="mobile" value={formData.mobile} onChange={handleChange} fullWidth />
            <TextField label="آدرس ایمیل" name="emailAddress" value={formData.emailAddress} onChange={handleChange} fullWidth />
            <TextField label="توضیحات من" name="myDescription" value={formData.myDescription} onChange={handleChange} fullWidth />
            <TextField label="توضیحات دریافت شده" name="rDescription" value={formData.rDescription} onChange={handleChange} fullWidth />

            <Grid item xs={12}>
              <BirthdaySelector
                value={{
                  BirthDateYear: formData.birthDateYear,
                  BirthDateMonth: formData.birthDateMonth,
                  BirthDateDay: formData.birthDateDay,
                }}
                onChange={(date) => setFormData({ ...formData, birthDate: date })}
              />
            </Grid>
            <GenderDropdown gender={formData.gender} handleChange={handleChange} genders={dropdownData.genders} />
            <ProvinceDropdown province={formData.province} handleChange={handleChange} provinces={dropdownData.provinces} />
            <HealtStatusDropdown healtStatus={formData.healtStatus} handleChange={handleChange} healtStatusOptions={dropdownData.healtStatus} />
            <LiveTypeDropdown liveType={formData.liveType} handleChange={handleChange} liveTypes={dropdownData.liveTypes} />
            <MarriageStatusDropdown marriageStatus={formData.marriageStatus} handleChange={handleChange} marriageStatusOptions={dropdownData.marriageStatus} />

            <HomeValueDropDown homeValue={formData.homeValue} handleChange={handleChange} homeValues={dropdownData.homeValue} />
            <CarValuesDropdown carValue={formData.carValue} handleChange={handleChange} carValueOptions={dropdownData.carValue} />
            <IncomeAmountDropDown incomeAmount={formData.incomeAmount} handleChange={handleChange} incomeAmounts={dropdownData.incomeAmount} />
            <RelationTypeDropDown relationType={formData.relationType} handleChange={handleChange} relationTypes={dropdownData.relationType} />
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                ویرایش اطلاعات
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={() => setIsChangePasswordOpen(true)}>
                تغییر کلمه عبور
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <ChangePasswordModal open={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
      </Container>
  );
};

export default UpdateProfile;
