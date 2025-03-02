import React, { useState } from 'react';
import { Grid, MenuItem, Select, InputLabel, FormControl, TextField, Button } from '@mui/material';
import moment from 'moment-jalaali'; // برای تبدیل تاریخ شمسی به میلادی

const DateSelector = () => {
  const [formData, setFormData] = useState({
    day: '',
    month: '',
    year: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // تبدیل تاریخ شمسی به میلادی
    const { day, month, year } = formData;
    if (day && month && year) {
      const persianDate = `${year}/${month}/${day}`;
      const gregorianDate = moment.from(persianDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');

      // ارسال به بک‌اند
      // ارسال داده به بک‌اند
    }
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>روز</InputLabel>
          <Select
            name="day"
            value={formData.day}
            onChange={handleChange}
            label="روز"
          >
            {[...Array(31)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>ماه</InputLabel>
          <Select
            name="month"
            value={formData.month}
            onChange={handleChange}
            label="ماه"
          >
            {[...Array(12)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>سال</InputLabel>
          <Select
            name="year"
            value={formData.year}
            onChange={handleChange}
            label="سال"
          >
            {[...Array(51)].map((_, index) => (
              <MenuItem key={1350 + index} value={1350 + index}>
                {1350 + index}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          ارسال
        </Button>
      </Grid>
    </Grid>
  );
};

export default DateSelector;
