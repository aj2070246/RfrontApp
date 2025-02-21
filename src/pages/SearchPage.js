import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid, Box } from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Alert, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import { searchUsers, getDropdownItems } from '../api'; // اضافه کردن متد جدید
import {
  GenderDropdown, AgeRangeDropdown, ProvinceDropdown,
  HealtStatusDropdown, LiveTypeDropdown, MarriageStatusDropdown,
  CarValuesDropdown,
  HomeValueDropDown,
  IncomeAmountDropDown,
  OnlineStatusDropDown,
  ProfilePhotoStatusDropDown,
  RelationTypeDropDown
} from './registerPage/Dropdowns';
const SearchPage = () => {
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [location, setLocation] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [liveType, setLiveType] = useState('');
  const [marriageStatus, setMarriageStatus] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const [incomeAmount, setIncomeAmount] = useState('');
  const [homeValue, setHomeValue] = useState('');
  const [carValue, setCarValue] = useState('');
  const [onlineStatus, setOnlineStatus] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [relationType, setRelationType] = useState('');

  const [formData, setFormData] = useState({
    gender: '',
    ageRange: '',
    province: '',
    healtStatus: '',
    liveType: '',
    marriageStatus: '',
    incomeAmount: '',
    homeValue: '',
    carValue: '',
    onlineStatus: '',
    profilePhoto: '',
    relationType: ''
  });

  // اضافه کردن state برای ذخیره داده‌های دراپ‌داون‌ها
  const [dropdownData, setDropdownData] = useState({
    ages: [],
    genders: [],
    healtStatus: [],
    liveTypes: [],
    marriageStatus: [],
    provinces: [],
    incomeAmount: [],
    homeValue: [],
    carValue: [],
    onlineStatus: [],
    profilePhoto: [],
    relationType: []
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const dropdownResponse = await getDropdownItems();
        if (dropdownResponse.data.isSuccess) {
          setDropdownData({
            ages: dropdownResponse.data.model.ages || [],
            genders: dropdownResponse.data.model.genders || [],
            healtStatus: dropdownResponse.data.model.healtStatus || [],
            liveTypes: dropdownResponse.data.model.liveTypes || [],
            marriageStatus: dropdownResponse.data.model.marriageStatus || [],
            provinces: dropdownResponse.data.model.provinces || [],
            incomeAmount: dropdownResponse.data.model.incomeAmount || [],
            carValue: dropdownResponse.data.model.carValue || [],
            homeValue: dropdownResponse.data.model.homeValue || [],
            onlineStatus: dropdownResponse.data.model.onlineStatus || [],
            profilePhoto: dropdownResponse.data.model.profilePhoto || [],
            relationType: dropdownResponse.data.model.relationType || [],
          });
        }
      } catch (error) {
        console.error('❌ Error fetching dropdown data:', error);
      } finally {
      }
    };

    fetchData();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSearch = async () => {
    try {
      setError(null); // پاک کردن خطا قبل از جستجو

      // ساخت داده‌ها بر اساس مقادیر انتخابی و تبدیل رشته به id
      const requestData = {
        pageIndex: 0,
        pageItemsCount: 10,
        ageIdFrom: formData.ageRange ? parseInt(formData.ageRange) : 0,
        ageIdTo: formData.ageRange ? parseInt(formData.ageRange) : 0,
        genderId: formData.gender ? parseInt(formData.gender) : 0,
        healthStatusId: formData.healtStatus ? parseInt(formData.healtStatus) : 0,
        liveTypeId: formData.liveType ? parseInt(formData.liveType) : 0,
        marriageStatusId: formData.marriageStatus ? parseInt(formData.marriageStatus) : 0,
        provinceId: formData.province ? parseInt(formData.province) : 0,
        incomeId: formData.incomeAmount ? parseInt(formData.incomeAmount) : 0,
        carValueId: formData.carValue ? parseInt(formData.carValue) : 0,
        homeValueId: formData.homeValue ? parseInt(formData.homeValue) : 0,
        profilePhotoId: formData.profilePhoto ? parseInt(formData.profilePhoto) : 0,
        onlineStatusId: formData.onlineStatus ? parseInt(formData.onlineStatus) : 0,
        relationTypeId: formData.relationType ? parseInt(formData.relationType) : 0,
      };

      // فراخوانی تابع searchUsers با ارسال requestData
      const response = await searchUsers(requestData);

      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'خطایی رخ داده است');
      }

      setResults(response.data.model || []); // ذخیره داده‌ها
    } catch (err) {
      setError(err.message);
    }
  };
  const defaultAvatar = "/pictures/defAv.png"; // عکس پیش‌فرض

  return (
    <Box sx={{ padding: 2 }} dir="rtl">
      <h2 style={{ textAlign: 'center' }}>جستجوی کاربران</h2>

      <Grid container spacing={2}>
        <GenderDropdown gender={formData.gender} handleChange={handleChange} genders={dropdownData.genders} />
        <AgeRangeDropdown ageRange={formData.ageRange} handleChange={handleChange} ages={dropdownData.ages} />
        <ProvinceDropdown province={formData.province} handleChange={handleChange} provinces={dropdownData.provinces} />
        <HealtStatusDropdown healtStatus={formData.healtStatus} handleChange={handleChange} healtStatusOptions={dropdownData.healtStatus} />
        <LiveTypeDropdown liveType={formData.liveType} handleChange={handleChange} liveTypes={dropdownData.liveTypes} />
        <MarriageStatusDropdown marriageStatus={formData.marriageStatus} handleChange={handleChange} marriageStatusOptions={dropdownData.marriageStatus} />
        <RelationTypeDropDown onlineStatus={formData.relationType} handleChange={handleChange} onlineStatuss={dropdownData.relationType} />

        <HomeValueDropDown homeValue={formData.homeValue} handleChange={handleChange} homeValues={dropdownData.homeValue} />
        <CarValuesDropdown carValue={formData.carValue} handleChange={handleChange} carValueOptions={dropdownData.carValue} />
        <IncomeAmountDropDown incomeAmount={formData.incomeAmount} handleChange={handleChange} incomeAmounts={dropdownData.incomeAmount} />
        <ProfilePhotoStatusDropDown profilePhotoStatus={formData.profilePhoto} handleChange={handleChange} profilePhotoStatuss={dropdownData.profilePhoto} />
        <OnlineStatusDropDown onlineStatus={formData.onlineStatus} handleChange={handleChange} onlineStatuss={dropdownData.onlineStatus} />


        {/* دکمه جستجو */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
            جستجو
          </Button>
        </Grid>

        {/* نمایش خطا */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {/* نمایش نتایج جستجو */}
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          {results.length > 0 ? (
            results.map((user) => (
              <Grid item xs={12} sm={6} md={3} key={user.id}>
                 <Card sx={{ margin: 1, bgcolor: 'pink' }}> {/* رنگ پس‌زمینه کارد */}
      <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none' }} target='_blank'>
        <CardActionArea>
          <Box
            sx={{
              position: "relative",
              height: 140, // ارتفاع ثابت
              width: "100%", // پر کردن عرض کارت
              backgroundColor: "red", // رنگ پس‌زمینه قرمز
              overflow: "hidden", // جلوگیری از نمایش اضافی
            }}
          >
            <CardMedia
              component="img"
              image={`http://localhost:5000/connection/downloadProfilePhoto?userId=${user.id}`}
                         
              alt="User Avatar"
              onError={(e) => {
                e.target.onerror = null; // جلوگیری از حلقه بی‌پایان
                e.target.src = ""; // تصویر را خالی می‌کنیم تا پس‌زمینه قرمز دیده شود
              }}
              sx={{
                height: "100%", // پر کردن ارتفاع
                width: "100%", // پر کردن عرض کارت
                objectFit: "contain", // برش تصویر در صورت نیاز
                position: "absolute", // قرارگیری در بالای Box
                top: 0,
                left: 0,
              }}
            />
          </Box>
        </CardActionArea>
      </Link>
      <CardContent>
        <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none' }} target='_blank'>
          <Typography variant="h6">
            {user.firstName} {user.lastName}
          </Typography>
        </Link>
        <Typography variant="body2" color="textSecondary">
          {user.myDescription}
        </Typography>
        <Link to={`/chat/${user.id}`}>
          <Button variant="contained" color="primary" sx={{ mt: 3 }} fullWidth>
            شروع گفتگو
          </Button>
        </Link>
      </CardContent>
    </Card>

              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" textAlign="center">
                هیچ نتیجه‌ای برای جستجوی شما پیدا نشد.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );



};

export default SearchPage;
