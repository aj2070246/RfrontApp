import React, { useState, useEffect } from 'react';
import { Grid, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { toGregorian } from 'jalaali-js';

const BirthdaySelector = ({ value, onChange }) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { label: 'فروردین', value: 1 },
    { label: 'اردیبهشت', value: 2 },
    { label: 'خرداد', value: 3 },
    { label: 'تیر', value: 4 },
    { label: 'مرداد', value: 5 },
    { label: 'شهریور', value: 6 },
    { label: 'مهر', value: 7 },
    { label: 'آبان', value: 8 },
    { label: 'آذر', value: 9 },
    { label: 'دی', value: 10 },
    { label: 'بهمن', value: 11 },
    { label: 'اسفند', value: 12 },
  ];
  const years = Array.from({ length: 51 }, (_, i) => 1350 + i); // سال‌های 1350 تا 1400

  // مقداردهی اولیه از مقدار `value`
  useEffect(() => {
    if (value) {
      const { BirthDateYear, BirthDateMonth, BirthDateDay } = value;
      if (BirthDateYear && BirthDateMonth && BirthDateDay) {
        setYear(BirthDateYear);
        setMonth(BirthDateMonth);
        setDay(BirthDateDay);
      }
    }
  }, [value]);

  const handleChange = () => {
    if (day && month && year) {
      try {
        const { gy, gm, gd } = toGregorian(Number(year), Number(month), Number(day)); // تبدیل به میلادی
        console.log("date : ", gy, gm, gd);

        // بررسی این که gy، gm و gd معتبر هستند
        if (gy !== undefined && gm !== undefined && gd !== undefined) {
          console.log(`Converted Date: ${gy}-${gm.toString().padStart(2, '0')}-${gd.toString().padStart(2, '0')}`);
          // ارسال تاریخ میلادی
          onChange(`${gy}-${gm.toString().padStart(2, '0')}-${gd.toString().padStart(2, '0')}`);
        } else {
          console.error("Invalid date returned from toGregorian");
        }
      } catch (error) {
        console.error("Error converting date:", error);
      }
    }
  };

  useEffect(() => {
    handleChange();
  }, [day, month, year]); // فقط وقتی که یکی از مقادیر تغییر کرد، تابع handleChange را اجرا کن

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel>روز</InputLabel>
          <Select value={day} onChange={(e) => setDay(e.target.value)}>
            <MenuItem value=""><em>انتخاب کنید</em></MenuItem>
            {days.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel>ماه</InputLabel>
          <Select value={month} onChange={(e) => setMonth(e.target.value)}>
            <MenuItem value=""><em>انتخاب کنید</em></MenuItem>
            {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel>سال</InputLabel>
          <Select value={year} onChange={(e) => setYear(e.target.value)}>
            <MenuItem value=""><em>انتخاب کنید</em></MenuItem>
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default BirthdaySelector;
