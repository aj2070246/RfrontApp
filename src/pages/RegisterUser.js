import React, { useState, useEffect } from "react";

import { getDropdownItems, getCaptcha, registerUser } from "../api";

import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    captchaId: "",
    captchaValue: "",
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    mobile: "",
    myDescription: "",
    rDescription: "",
    birthDate: "",
    gender: "",
    healthStatus: "",
    liveType: "",
    marriageStatus: "",
    province: "",
    ageRange: "",
  });

  const [captcha, setCaptcha] = useState({ image: "", id: "" });
  const [dropdownData, setDropdownData] = useState({
    genders: [],
    provinces: [],
    healthStatus: [], // مقدار پیش‌فرض به آرایه خالی تغییر داده شد

    liveTypes: [],
    marriageStatus: [],
    ages: [],
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await getDropdownItems();
        if (response.data.isSuccess) {
          setDropdownData(response.data.model);
        } else {
          throw new Error(response.data.message);
        }
      } catch (err) {
        setError("خطایی در دریافت داده‌ها رخ داده است");
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchCaptcha = async () => {
      try {
        const response = await getCaptcha();
        setCaptcha({ image: response.data.image, id: response.data.guid });
        setFormData((prev) => ({ ...prev, captchaId: response.data.guid }));
      } catch (error) {
        console.error("خطا در دریافت کپچا", error);
      }
    };

    fetchCaptcha();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      if (response.data.isSuccess) {
        alert("ثبت‌نام با موفقیت انجام شد!");
      } else {
        alert("خطا: " + response.data.message);
      }
    } catch (error) {
      console.error("خطا در ثبت‌نام", error);
    }
  };

  const refreshCaptcha = async () => {
    try {
      const response = await getCaptcha();
      setCaptcha({ image: response.data.image, id: response.data.guid });
      setFormData((prev) => ({ ...prev, captchaId: response.data.guid, captchaValue: "" }));
    } catch (error) {
      console.error("خطا در دریافت کپچا", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {error && (
          <Grid item xs={12}>
            <p style={{ color: "red" }}>{error}</p>
          </Grid>
        )}

        {/* فیلدهای متنی */}
        <Grid item xs={12}>
          <TextField fullWidth label="نام" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="نام خانوادگی" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="نام کاربری" name="userName" value={formData.userName} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth type="password" label="رمز عبور" name="password" value={formData.password} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="شماره موبایل" name="mobile" value={formData.mobile} onChange={handleChange} required />
        </Grid>

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

        {/* دراپ‌داون گروه سنی */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>گروه سنی</InputLabel>
            <Select name="ageRange" value={formData.ageRange} onChange={handleChange}>
              {dropdownData.ages.map((ageItem) => (
                <MenuItem key={ageItem.id} value={ageItem.id}>
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
            <Select name="province" value={formData.province} onChange={handleChange}>
              {dropdownData.provinces.map((provinceItem) => (
                <MenuItem key={provinceItem.id} value={provinceItem.id}>
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
            <Select name="healthStatus" value={formData.healthStatus} onChange={handleChange}>
  {dropdownData.healthStatus?.map((statusItem) => (
    <MenuItem key={statusItem.id} value={statusItem.id}>
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
            <Select name="liveType" value={formData.liveType} onChange={handleChange}>
              {dropdownData.liveTypes.map((typeItem) => (
                <MenuItem key={typeItem.id} value={typeItem.id}>
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
            <Select name="marriageStatus" value={formData.marriageStatus} onChange={handleChange}>
              {dropdownData.marriageStatus.map((statusItem) => (
                <MenuItem key={statusItem.id} value={statusItem.id}>
                  {statusItem.itemValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* تکست‌باکس‌های توضیحات */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="توضیحات من"
            name="myDescription"
            value={formData.myDescription}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="توضیحات رفرال"
            name="rDescription"
            value={formData.rDescription}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </Grid>

        {/* کپچا */}
   
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
  <Grid item xs="auto">
    <img src={captcha.image} alt="کد امنیتی" style={{ width: "200px", height: "50px" }} />
  </Grid>
  <Grid item xs="auto" style={{ position: "relative" }}>
    <button 
      onClick={refreshCaptcha} 
      style={{ 
        position: "absolute", 
        top: "50%", 
        right: "-30px", // تغییر موقعیت دکمه
        transform: "translateY(-50%)", 
        background: "none", 
        border: "none", 
        cursor: "pointer", 
        color: "white",  
        padding: "5px",
        borderRadius: "50%",
        backgroundColor: "green", 
        transition: "background-color 0.3s ease"
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = "red"}  
      onMouseLeave={(e) => e.target.style.backgroundColor = "green"}  
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
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
      value={formData.captchaValue}
      onChange={handleChange}
      required
    />
  </Grid>
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
