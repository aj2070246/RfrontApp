// src/components/SearchPage.js
import React, { useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid, Box } from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { searchUsers } from '../api';

const SearchPage = () => {
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

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
        <Grid item xs={12}>
          <FormControl fullWidth>
            
          <InputLabel>شهر</InputLabel>

            <Select value={gender} onChange={(e) => setGender(e.target.value)} label="جنسیت">
              <MenuItem value="male">مرد</MenuItem>
              <MenuItem value="female">زن</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
          <InputLabel>شهر</InputLabel>

  
   <Select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} label="گروه سنی">
              <MenuItem value="18-25">18-25</MenuItem>
              <MenuItem value="26-35">26-35</MenuItem>
              <MenuItem value="36-45">36-45</MenuItem>
              <MenuItem value="46+">46+</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>شهر</InputLabel>
            <Select value={location} onChange={(e) => setLocation(e.target.value)} label="مکان">
              <MenuItem value="tehran">تهران</MenuItem>
              <MenuItem value="esfahan">اصفهان</MenuItem>
              <MenuItem value="shiraz">شیراز</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
            جستجو
          </Button>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

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
