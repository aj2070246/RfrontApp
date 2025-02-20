import React, { useState, useEffect } from 'react';
import { Grid, Button, Container, Paper, TextField } from '@mui/material';
import { getCaptcha, registerUser, getDropdownItems } from '../../api';
import { 
  GenderDropdown, AgeRangeDropdown, ProvinceDropdown, 
  HealtStatusDropdown, LiveTypeDropdown, MarriageStatusDropdown 
} from './Dropdowns';

const RegisterForm = () => {
  const [captcha, setCaptcha] = useState({ id: null, image: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(true); // وضعیت بارگذاری کپچا
  const [dropdownData, setDropdownData] = useState({
    ages: [],
    genders: [],
    healtStatus: [],
    liveTypes: [],
    marriageStatus: [],
    provinces: [],
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    mobile: '',
    captchaValue: '',
    captchaId: null, 
    gender: '',
    ageRange: '',
    province: '',
    healtStatus: '',
    liveType: '',
    marriageStatus: '',
    rDescription: '',
    myDescription: ''
  });

  // دریافت کپچا از سرور
  const fetchCaptcha = async () => {
    setIsCaptchaLoading(true); // شروع بارگذاری کپچا
    try {
      console.log("🔄 Fetching Captcha...");
      const captchaResponse = await getCaptcha();
      console.log("📩 Captcha Response:", captchaResponse.data);

      if (captchaResponse.data && captchaResponse.data.id && captchaResponse.data.image) {
        setCaptcha({ id: captchaResponse.data.id, image: captchaResponse.data.image });
        setFormData(prevData => ({
          ...prevData,
          captchaId: captchaResponse.data.id
        }));
        console.log("✅ Captcha ID fetched:", captchaResponse.data.id);
      } else {
        console.error("⚠️ Error: Captcha data is incomplete", captchaResponse.data);
      }
    } catch (error) {
      console.error('❌ Error fetching captcha:', error);
    } finally {
      setIsCaptchaLoading(false); // پایان بارگذاری کپچا
    }
  };

  // دریافت اطلاعات فرم و کپچا
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔄 Fetching dropdown data...");
        const dropdownResponse = await getDropdownItems();
        if (dropdownResponse.data.isSuccess) {
          setDropdownData({
            ages: dropdownResponse.data.model.ages || [],
            genders: dropdownResponse.data.model.genders || [],
            healtStatus: dropdownResponse.data.model.healtStatus || [],
            liveTypes: dropdownResponse.data.model.liveTypes || [],
            marriageStatus: dropdownResponse.data.model.marriageStatus || [],
            provinces: dropdownResponse.data.model.provinces || [],
          });
          console.log("✅ Dropdown data fetched.");
        } else {
          console.error('⚠️ Error: API returned unsuccessful response for dropdowns');
        }

        await fetchCaptcha(); // دریافت کپچا و صبر تا مقدار بیاد
        
      } catch (error) {
        console.error('❌ Error fetching dropdown data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 Submitting Captcha ID:", formData.captchaId);

    if (!formData.captchaId) {
      console.error("❌ Captcha ID is missing! Registration aborted.");
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log('✅ Form submitted successfully:', response.data);
    } catch (error) {
      console.error('❌ Error submitting form:', error);
    }
  };

  const refreshCaptcha = async () => {
    await fetchCaptcha(); // دریافت مجدد کپچا
  };

  if (isLoading) {
    return <div>⏳ لطفاً صبر کنید، در حال بارگیری اطلاعات...</div>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <TextField label="نام" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth />
            <TextField label="نام خانوادگی" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth />
            <TextField label="نام کاربری" name="userName" value={formData.userName} onChange={handleChange} fullWidth />
            <TextField label="رمز عبور" name="password" value={formData.password} onChange={handleChange} type="password" fullWidth />
            <TextField label="شماره موبایل" name="mobile" value={formData.mobile} onChange={handleChange} fullWidth />
            <TextField label="توضیحات من" name="myDescription" value={formData.myDescription} onChange={handleChange} fullWidth />
            <TextField label="توضیحات دریافت شده" name="rDescription" value={formData.rDescription} onChange={handleChange} fullWidth />

            {/* دراپ‌دان‌ها */}
            <GenderDropdown gender={formData.gender} handleChange={handleChange} genders={dropdownData.genders} />
            <AgeRangeDropdown ageRange={formData.ageRange} handleChange={handleChange} ages={dropdownData.ages} />
            <ProvinceDropdown province={formData.province} handleChange={handleChange} provinces={dropdownData.provinces} />
            <HealtStatusDropdown healtStatus={formData.healtStatus} handleChange={handleChange} healtStatusOptions={dropdownData.healtStatus} />
            <LiveTypeDropdown liveType={formData.liveType} handleChange={handleChange} liveTypes={dropdownData.liveTypes} />
            <MarriageStatusDropdown marriageStatus={formData.marriageStatus} handleChange={handleChange} marriageStatusOptions={dropdownData.marriageStatus} />

            {/* کپچا */}
            <Grid item xs={12} container spacing={2} alignItems="center">
              <Grid item xs={6}>
                {isCaptchaLoading ? ( // بررسی وضعیت بارگذاری کپچا
                  <div>⏳ در حال بارگیری کپچا...</div>
                ) : (
                  captcha.image ? (
                    <img src={captcha.image} alt="Captcha" style={{ width: '100%' }} />
                  ) : (
                    <div>⚠️ تصویر کپچا بارگذاری نشد!</div>
                  )
                )}
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" onClick={refreshCaptcha}>🔄 دریافت مجدد</Button>
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  label="کد امنیتی" 
                  name="captchaValue" 
                  value={formData.captchaValue} 
                  onChange={handleChange} 
                  fullWidth 
                />
              </Grid>
            </Grid>

            {/* دکمه ثبت‌نام */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                ثبت‌نام
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ___RegisterForm;
