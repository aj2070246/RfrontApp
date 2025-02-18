import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid, Box } from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { searchUsers, getDropdownItems } from '../api'; // اضافه کردن متد جدید

const SearchPage = () => {
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [location, setLocation] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [liveType, setLiveType] = useState('');
  const [marriageStatus, setMarriageStatus] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  // اضافه کردن state برای ذخیره داده‌های دراپ‌داون‌ها
  const [dropdownData, setDropdownData] = useState({
    ages: [],
    genders: [],
    provinces: [],
    healtStatus: [],
    liveTypes: [],
    marriageStatus: []
  });

  // بارگذاری داده‌های دراپ‌داون‌ها از API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDropdownItems();
        if (response.data.isSuccess) {
          setDropdownData(response.data.model); // ذخیره داده‌ها در state
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        setError('خطایی در دریافت داده‌ها رخ داده است');
      }
    };

    fetchData();
  }, []);


  
  const handleSearch = async () => {
    try {
      setError(null); // پاک کردن خطا قبل از جستجو
  
      // ساخت داده‌ها بر اساس مقادیر انتخابی و تبدیل رشته به id
      const requestData = {
        pageIndex: 0,
        pageItemsCount: 10, // می‌تونی این مقدار رو به دلخواه تغییر بدی
        ageIdFrom: ageRange ? parseInt(ageRange) : 0, // اگر خالی بود 0 می‌فرسته
        ageIdTo: ageRange ? parseInt(ageRange) : 0,   // اگر خالی بود 0 می‌فرسته
        genderId: gender ? parseInt(gender) : 0,      // اگر خالی بود 0 می‌فرسته
        healthStatusId: healthStatus ? parseInt(healthStatus) : 0,  // اگر خالی بود 0 می‌فرسته
        liveTypeId: liveType ? parseInt(liveType) : 0,    // اگر خالی بود 0 می‌فرسته
        marriageStatusId: marriageStatus ? parseInt(marriageStatus) : 0, // اگر خالی بود 0 می‌فرسته
        provinceId: location ? parseInt(location) : 0,  // اگر خالی بود 0 می‌فرسته
        isOnline: true // فرض بر آنلاین بودن
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
  
  return (
    <Box sx={{ padding: 2 }} dir="rtl">
      <h2 style={{ textAlign: 'center' }}>جستجوی کاربران</h2>
  
      <Grid container spacing={2}>
        {/* دراپ‌داون جنسیت */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>جنسیت</InputLabel>
            <Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}  // فقط مقدار id ذخیره می‌شود
              label="جنسیت"
            >
              {dropdownData.genders.map((genderItem) => (
                <MenuItem key={genderItem.id} value={genderItem.id}>  {/* ارسال id به جای itemValue */}
                  {genderItem.itemValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
  
        {/* دراپ‌داون گروه سنی */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>گروه سنی</InputLabel>
            <Select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}  // فقط مقدار id ذخیره می‌شود
              label="گروه سنی"
            >
              {dropdownData.ages.map((ageItem) => (
                <MenuItem key={ageItem.id} value={ageItem.id}>  {/* ارسال id به جای itemValue */}
                  {ageItem.itemValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
  
        {/* دراپ‌داون شهر */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>شهر</InputLabel>
            <Select
              value={location}
              onChange={(e) => setLocation(e.target.value)}  // فقط مقدار id ذخیره می‌شود
              label="مکان"
            >
              {dropdownData.provinces.map((provinceItem) => (
                <MenuItem key={provinceItem.id} value={provinceItem.id}>  {/* ارسال id به جای itemValue */}
                  {provinceItem.itemValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
  
        {/* دراپ‌داون وضعیت سلامت */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>وضعیت سلامت</InputLabel>
            <Select
              value={healthStatus}
              onChange={(e) => setHealthStatus(e.target.value)}  // فقط مقدار id ذخیره می‌شود
              label="وضعیت سلامت"
            >
              {dropdownData.healtStatus.map((statusItem) => (
                <MenuItem key={statusItem.id} value={statusItem.id}>  {/* ارسال id به جای itemValue */}
                  {statusItem.itemValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
  
        {/* دراپ‌داون نوع زندگی */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>نوع زندگی</InputLabel>
            <Select
              value={liveType}
              onChange={(e) => setLiveType(e.target.value)}  // فقط مقدار id ذخیره می‌شود
              label="نوع زندگی"
            >
              {dropdownData.liveTypes.map((typeItem) => (
                <MenuItem key={typeItem.id} value={typeItem.id}>  {/* ارسال id به جای itemValue */}
                  {typeItem.itemValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
  
        {/* دراپ‌داون وضعیت تاهل */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>وضعیت تاهل</InputLabel>
            <Select
              value={marriageStatus}
              onChange={(e) => setMarriageStatus(e.target.value)}  // فقط مقدار id ذخیره می‌شود
              label="وضعیت تاهل"
            >
              {dropdownData.marriageStatus.map((statusItem) => (
                <MenuItem key={statusItem.id} value={statusItem.id}>  {/* ارسال id به جای itemValue */}
                  {statusItem.itemValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
  
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
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} // آواتار تصادفی
                    alt="User Avatar"
                  />
                  <CardContent>
                    <Typography variant="h6">
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.myDescription}
                    </Typography>
                    <Link to={`/chat/${user.id}`}>
                      <Button size="small" color="primary">
                        شروع چت
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
