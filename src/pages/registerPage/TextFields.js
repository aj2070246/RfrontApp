// src/register/TextFields.js
import React from 'react';
import { Grid, TextField } from '@mui/material';

const TextFields = ({ label, name, value, onChange, type = "text", multiline = false, rows = 1 }) => {
  return (
    <Grid item xs={12}>
      <TextField
        fullWidth
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        multiline={multiline}
        rows={rows}
        required
      />
    </Grid>
  );
};

export default TextFields;
