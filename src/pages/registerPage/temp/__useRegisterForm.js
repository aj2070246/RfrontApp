// 📂 registerPage/RegisterForm.js
import React from "react";
import { TextField, Button, Grid, FormControl, Select, MenuItem, InputLabel, IconButton } from "@mui/material";
// import RefreshIcon from "@mui/icons-material/Refresh";
import useRegisterForm from "./__useRegisterForm"; // Import the hook

const RegisterForm = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    captcha,
    refreshCaptcha,
    dropdownData,
    error,
  } = useRegisterForm(); // Use the custom hook here

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {error && <Grid item xs={12}><p style={{ color: "red" }}>{error}</p></Grid>}

        {/* سایر فیلدها */}

        {/* دراپ‌داون جنسیت */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>جنسیت</InputLabel>
            <Select name="gender" value={formData.gender} onChange={handleChange}>
              {dropdownData.genders.map((genderItem) => (
                <MenuItem key={genderItem.id} value={genderItem.id}>
                  {genderItem.itemValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* سایر دراپ‌داون‌ها */}

        {/* کپچا */}
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <img src={captcha.image} alt="کد امنیتی" style={{ width: "200px", height: "50px" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="کد امنیتی" name="captchaValue" value={formData.captchaValue} onChange={handleChange} required />
          <IconButton onClick={refreshCaptcha} style={{ position: "absolute", top: "50%", right: "10px", transform: "translateY(-50%)" }}>
            {/* <RefreshIcon /> */}
          </IconButton>
        </Grid>

        {/* دکمه ارسال */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>
            ثبت‌نام
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default RegisterForm;
