import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';

const Dropdowns = ({ label, name, value, onChange, options }) => {
  return (
    <Grid item xs={12}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select name={name} value={value} onChange={onChange}>
          {options && options.length > 0 ? (
            options.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.itemValue}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>داده‌ای موجود نیست</MenuItem>
          )}
        </Select>
      </FormControl>
    </Grid>
  );
};

const GenderDropdown = ({ gender, handleChange, genders }) => (
  <Dropdowns
    label="جنسیت"
    name="gender"
    value={gender}
    onChange={handleChange}
    options={genders}
  />
);

const AgeRangeDropdown = ({ ageRange, handleChange, ages }) => (
  <Dropdowns
    label="گروه سنی"
    name="ageRange"
    value={ageRange}
    onChange={handleChange}
    options={ages}
  />
);

const ProvinceDropdown = ({ province, handleChange, provinces }) => (
  <Dropdowns
    label="شهر"
    name="province"
    value={province}
    onChange={handleChange}
    options={provinces}
  />
);

const HealtStatusDropdown = ({ healtStatus, handleChange, healtStatusOptions }) => (
  <Dropdowns
    label="وضعیت سلامت"
    name="healtStatus"
    value={healtStatus}
    onChange={handleChange}
    options={healtStatusOptions}
  />
);

const LiveTypeDropdown = ({ liveType, handleChange, liveTypes }) => (
  <Dropdowns
    label="نوع زندگی"
    name="liveType"
    value={liveType}
    onChange={handleChange}
    options={liveTypes}
  />
);

const MarriageStatusDropdown = ({ marriageStatus, handleChange, marriageStatusOptions }) => (
  <Dropdowns
    label="وضعیت تاهل"
    name="marriageStatus"
    value={marriageStatus}
    onChange={handleChange}
    options={marriageStatusOptions}
  />
);

export {
  GenderDropdown,
  AgeRangeDropdown,
  ProvinceDropdown,
  HealtStatusDropdown,
  LiveTypeDropdown,
  MarriageStatusDropdown
};
