import { FaTimes, FaCheckCircle, FaSave, FaEdit, FaKey, FaCamera } from "react-icons/fa";

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';


import { Button, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from 'react';
import { Container, Paper, TextField, Snackbar, Alert, Modal, Box } from '@mui/material';
import { UpdateUserInfo, getMyProfileDataForEdit, getDropdownItems, getDefaultAvatarAddress, getUserProfilePhoto } from '../api'; // Import necessary API functions
import {
  GenderDropdown,
  ProvinceDropdown,
  HealtStatusDropdown,
  LiveTypeDropdown,
  MarriageStatusDropdown,
  CarValuesDropdown,
  HomeValueDropDown,
  IncomeAmountDropDown,
  RelationTypeDropDown,
  GhadDropDown,
  VaznDropDown,
  TipDropDown,
  ZibaeeDropDown,
  CheildCountDropDown,
  RangePoostDropDown,
  FirstCheildAgeDown
} from './registerPage/Dropdowns';
import BirthdaySelector from './registerPage/BirthdaySelector';
import ChangePasswordModal from './ChangePasswordModal';
import VerifyEmailCode from './VerifyEmailCode';

import ProfilePictureUpload from './UploadPicture';

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

  
  const validateMobile = (value) => /^\d{10}$/.test(value);
  const validateEmail = (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);

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
    ghad: '',
    vazn: '',
    tipNumber: '',
    zibaeeNumber: '',
    cheildCount: '',
    firstCheildAge: '',
    rangePoost: '',
  });
  const [results, setResults] = useState([]); // مقدار پیش‌فرض آرایه خالی
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [currentUserId, setCurrentUserId] = useState(null); // To hold the current user's ID
  const [loading, setLoading] = useState(false); // For loading state

  useEffect(() => {
    setCurrentUserId(localStorage.getItem('userId')); // Get user ID from local storage
    const fetchUserData = async () => {
      setLoading(true);
      const response = await getMyProfileDataForEdit(); // Fetch user info from API

      if (response && response.model) {
        setFormData(response.model); // مقداردهی فقط در صورت معتبر بودن داده
      } else {
        console.error("❌ دریافت اطلاعات کاربر ناموفق بود یا داده‌ها خالی هستند.");
        setFormData({}); // جلوگیری از کرش با مقداردهی پیش‌فرض
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const dropdownResponse = await getDropdownItems();
        if (dropdownResponse.data.isSuccess) {
          setDropdownData({
            healtStatus: dropdownResponse.data.model.healtStatus || [],
            liveTypes: dropdownResponse.data.model.liveTypes || [],
            marriageStatus: dropdownResponse.data.model.marriageStatus || [],
            provinces: dropdownResponse.data.model.provinces || [],
            incomeAmount: dropdownResponse.data.model.incomeAmount || [],
            carValue: dropdownResponse.data.model.carValue || [],
            homeValue: dropdownResponse.data.model.homeValue || [],
            relationType: dropdownResponse.data.model.relationType || [],

            ghad: dropdownResponse.data.model.ghad || [],
            vazn: dropdownResponse.data.model.vazn || [],
            tipNumber: dropdownResponse.data.model.tipNumber || [],
            zibaeeNumber: dropdownResponse.data.model.zibaeeNumber || [],
            cheildCount: dropdownResponse.data.model.cheildCount || [],
            firstCheildAge: dropdownResponse.data.model.firstCheildAge || [],
            rangePoost: dropdownResponse.data.model.rangePoost || [],

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
    try {
      const response = await UpdateUserInfo(formData);
      console.log('✅ Form submitted successfully:', response.data);

      if (response.data.isSuccess) {
        setSnackbar({ open: true, message: 'ثبت‌نام با موفقیت انجام شد!', severity: 'success' });

      } else {
        setSnackbar({ open: true, message: response.data.message, severity: 'error' });
      }
    } catch (error) {
      console.error('❌ Error submitting form:', error);
    }
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
            <br />
            <TextField label="نام خانوادگی" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth />
            <TextField label="نام کاربری" name="userName" value={formData.userName} onChange={handleChange} fullWidth />
            <TextField
              label="شماره موبایل"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              fullWidth
              placeholder="09123456789"
              inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }} // فقط عدد
              error={formData.mobile.length > 0 && !validateMobile(formData.mobile)}
              helperText={formData.mobile.length > 0 && !validateMobile(formData.mobile) ? "شماره موبایل باید دقیقا ۱۰ رقم باشد." : ""}
              onBlur={() => {
                if (formData.mobile.length === 10 && !validateMobile(formData.mobile)) {
                  alert("شماره موبایل باید دقیقا ۱۰ رقم باشد و فقط عدد باشد!");
                }
              }}
            />
            <TextField
              label="آدرس ایمیل"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              fullWidth

              placeholder="example@email.com"
              error={formData.emailAddress.length > 0 && !validateEmail(formData.emailAddress)}
              helperText={formData.emailAddress.length > 0 && !validateEmail(formData.emailAddress) ? "ایمیل معتبر نیست!" : ""}
              onBlur={() => {
                if (formData.emailAddress.length > 0 && !validateEmail(formData.emailAddress)) {
                  alert("ایمیل معتبر نیست!");
                }
              }}

              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {formData.emailAddressStatusId === 1 || formData.emailAddressStatusId === 2 ? (
                      <>
                        <IconButton
                          onClick={() => setIsVerifyOpen(true)}
                          style={{ color: 'red' }}>
                          <FaTimes />
                        </IconButton>
                        <div style={{ textAlign: 'center' }}
                          onClick={() => setIsVerifyOpen(true)}

                        >
                          <span style={{ color: 'red' }} >تایید نشده</span>
                          <br />
                          <span style={{ color: 'red' }}>کلیک کنید</span>
                        </div>
                      </>
                    ) : formData.emailAddressStatusId === 3 ? (
                      <>
                        <IconButton
                          style={{ color: 'green' }}>
                          <FaCheckCircle />
                        </IconButton>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ color: 'green' }}>تایید شده</span>
                        </div>
                      </>
                    ) : null}
                  </InputAdornment>
                ),
              }}
            />


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
            <ProvinceDropdown province={formData.province} handleChange={handleChange} provinces={dropdownData.provinces} />
            <HealtStatusDropdown healtStatus={formData.healtStatus} handleChange={handleChange} healtStatusOptions={dropdownData.healtStatus} />
            <LiveTypeDropdown liveType={formData.liveType} handleChange={handleChange} liveTypes={dropdownData.liveTypes} />
            <MarriageStatusDropdown marriageStatus={formData.marriageStatus} handleChange={handleChange} marriageStatusOptions={dropdownData.marriageStatus} />

            <HomeValueDropDown homeValue={formData.homeValue} handleChange={handleChange} homeValues={dropdownData.homeValue} />
            <CarValuesDropdown carValue={formData.carValue} handleChange={handleChange} carValueOptions={dropdownData.carValue} />
            <IncomeAmountDropDown incomeAmount={formData.incomeAmount} handleChange={handleChange} incomeAmounts={dropdownData.incomeAmount} />
            <RelationTypeDropDown relationType={formData.relationType} handleChange={handleChange} relationTypes={dropdownData.relationType} />

            <RangePoostDropDown values={formData.rangePoost} handleChange={handleChange} options={dropdownData.rangePoost} />
            <TipDropDown values={formData.tipNumber} handleChange={handleChange} options={dropdownData.tipNumber} />
            <ZibaeeDropDown values={formData.zibaeeNumber} handleChange={handleChange} options={dropdownData.zibaeeNumber} />
            <GhadDropDown values={formData.ghad} handleChange={handleChange} options={dropdownData.ghad} />
            <VaznDropDown values={formData.vazn} handleChange={handleChange} options={dropdownData.vazn} />
            <CheildCountDropDown values={formData.cheildCount} handleChange={handleChange} options={dropdownData.cheildCount} />
            <FirstCheildAgeDown values={formData.firstCheildAge} handleChange={handleChange} options={dropdownData.firstCheildAge} />

            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
              {/* تغییر کلمه عبور */}
              <br />
              <Grid item xs={6} sm={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<FaKey />}
                  onClick={() => setIsChangePasswordOpen(true)}
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
                  <Typography fontSize="0.85rem">تغییر رمز</Typography>
                </Button>
              </Grid>
              {/* تغییر تصویر پروفایل */}
              <Grid item xs={6} sm={3}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<FaCamera />}
                  onClick={() => setIsUploadModalOpen(true)}
                  sx={{
                    height: 50,
                    backgroundColor: "#4caf50",
                    "&:hover": { backgroundColor: "#3d8c40" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px", // فاصله بین آیکن و متن
                  }}
                >
                  <Typography fontSize="0.85rem">تغییر تصویر</Typography>
                </Button>
              </Grid>

              {/* ویرایش اطلاعات */}
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<FaSave />}
                  sx={{
                    height: 50,
                    backgroundColor: "#3f51b5",
                    "&:hover": { backgroundColor: "#32408f" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px", // فاصله بین آیکن و متن
                  }}
                >
                  <Typography fontSize="0.85rem">ذخیره</Typography>
                </Button>
              </Grid>

            </Grid>


          </Grid>
        </form>
      </Paper>
      <Modal open={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <ProfilePictureUpload />

        </Box>
      </Modal>

      <ChangePasswordModal open={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />

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


      <VerifyEmailCode open={isVerifyOpen} onClose={() => setIsVerifyOpen(false)} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <VerifyEmailCode open={isVerifyOpen} onClose={() => setIsVerifyOpen(false)} />

    </Container>
  );
};

export default UpdateProfile;
