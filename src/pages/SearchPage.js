// src/components/SearchPage.js
import React, { useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid, Box } from '@mui/material';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom'; // برای لینک به صفحه چت
import { searchUsers } from '../api'; // وارد کردن متد جستجو از api.js

const SearchPage = () => {
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]); // برای ذخیره نتایج جستجو

  const handleSearch = async () => {
    try {
      // ارسال درخواست به API از طریق متد searchUsers
      const response = await searchUsers(gender, ageRange, location);

      // ذخیره نتایج جستجو در state
      setResults(response.data);
      console.log('Results:', response.data); // نمایش نتایج در کنسول
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <h2 style={{ textAlign: 'center' }}>جستجوی کاربران</h2>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>جنسیت</InputLabel>
            <Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              label="جنسیت"
            >
              <MenuItem value="male">مرد</MenuItem>
              <MenuItem value="female">زن</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>گروه سنی</InputLabel>
            <Select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              label="گروه سنی"
            >
              <MenuItem value="18-25">18-25</MenuItem>
              <MenuItem value="26-35">26-35</MenuItem>
              <MenuItem value="36-45">36-45</MenuItem>
              <MenuItem value="46+">46+</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>مکان</InputLabel>
            <Select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              label="مکان"
            >
              <MenuItem value="tehran">تهران</MenuItem>
              <MenuItem value="esfahan">اصفهان</MenuItem>
              <MenuItem value="shiraz">شیراز</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSearch}
          >
            جستجو
          </Button>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            {/* نمایش نتایج جستجو */}
            {results.length > 0 ? (
              results.map((result, index) => (
                <Grid item xs={12} sm={6} md={3} key={result.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://via.placeholder.com/150" // نمایش تصویر از داده API
                      alt="کارت"
                    />
                    <CardContent>
                      <Typography variant="h6">
                        {result.FirstName} {result.LastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {result.MyDescription}
                      </Typography>
                      <Link to={`/chat/${result.id}`}>
                        <Button size="small" color="primary">
                          شروع چت
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                هیچ نتیجه‌ای برای جستجوی شما پیدا نشد.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchPage;
