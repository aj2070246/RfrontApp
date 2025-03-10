// src/register/Captcha.js
import React from 'react';
import { Grid, TextField } from '@mui/material';

const Captcha = ({ captchaImage, onRefresh, captchaValue, onChange }) => {
  return (
    <Grid container alignItems="center" justifyContent="center" spacing={2}>
      <Grid item xs="auto">
        <img src={captchaImage} alt="همسریابی | دوستیابی | همسریار" style={{ width: '200px', height: '50px' }} />
      </Grid>
      <Grid item xs="auto" style={{ position: 'relative' }}>
        <button onClick={onRefresh} style={{ position: 'absolute', top: '50%', right: '-30px', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: '5px', borderRadius: '50%', backgroundColor: 'green', transition: 'background-color 0.3s ease' }} onMouseEnter={(e) => e.target.style.backgroundColor = 'red'} onMouseLeave={(e) => e.target.style.backgroundColor = 'green'}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6" />
            <path d="M21 12a9 9 0 1 1-3-7.7l3 2.7" />
          </svg>
        </button>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="کد امنیتی"
          name="captchaValue"
          value={captchaValue}
          onChange={onChange}
          required
        />
      </Grid>
    </Grid>
  );
};

export default Captcha;
