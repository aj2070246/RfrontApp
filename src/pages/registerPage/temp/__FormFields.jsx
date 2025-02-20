
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const FormFields = ({ formData, handleChange, dropdownData }) => {
  return (
    <>
      <Grid item xs={12}><TextField fullWidth label="نام" name="firstName" value={formData.firstName} onChange={handleChange} required /></Grid>
      <Grid item xs={12}><TextField fullWidth label="نام خانوادگی" name="lastName" value={formData.lastName} onChange={handleChange} required /></Grid>
      <Grid item xs={12}><TextField fullWidth label="نام کاربری" name="userName" value={formData.userName} onChange={handleChange} required /></Grid>
      <Grid item xs={12}><TextField fullWidth type="password" label="رمز عبور" name="password" value={formData.password} onChange={handleChange} required /></Grid>
      <Grid item xs={12}><TextField fullWidth label="شماره موبایل" name="mobile" value={formData.mobile} onChange={handleChange} required /></Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>جنسیت</InputLabel>
          <Select name="gender" value={formData.gender} onChange={handleChange}>
            {dropdownData.genders.map((item) => (<MenuItem key={item.id} value={item.id}>{item.itemValue}</MenuItem>))}
          </Select>
        </FormControl>
      </Grid>
    </>
  );
};

export default FormFields;
