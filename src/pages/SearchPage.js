// src/components/SearchPage.js
import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid, Box } from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { searchUsers, getDropdownItems } from '../api'; // اضافه کردن متد جدید

const SearchPage = () => {
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  
  // اضافه کردن state برای ذخیره داده‌های دراپ‌داون‌ها
  const [dropdownData, setDropdownData] = useState({
    ages: [],
    genders: [],
    provinces: []
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
      const response = await searchUsers(gender, ageRange, location);

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
            <Select value={gender} onChange={(e) => setGender(e.target.value)} label="جنسیت">
              {dropdownData.genders.map((gender) => (
                <MenuItem key={gender.id} value={gender.itemValue}>
                  {gender.itemValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* دراپ‌داون گروه سنی */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>گروه سنی</InputLabel>
            <Select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} label="گروه سنی">
              {dropdownData.ages.map((age) => (
                <MenuItem key={age.id} value={age.itemValue}>
                  {age.itemValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* دراپ‌داون شهر */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>شهر</InputLabel>
            <Select value={location} onChange={(e) => setLocation(e.target.value)} label="مکان">
              {dropdownData.provinces.map((province) => (
                <MenuItem key={province.id} value={province.itemValue}>
                  {province.itemValue}
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
