import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
const Dropdowns = ({ label, name, value, onChange, options }) => {
  return (
    <Grid item xs={12}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select name={name} value={value} onChange={onChange}>
          {/* اضافه کردن گزینه انتخاب نمایید */}
          <MenuItem value={-1}>انتخاب نمایید</MenuItem>
          
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

const AgeFromDropdown = ({ ageRange, handleChange, ages }) => (
  <Dropdowns
    label="سن از"
    name="ageFrom"
    value={ageRange}
    onChange={handleChange}
    options={ages}
  />
);
const AgeRangeDropdown = ({ ageRange, handleChange, ages }) => (
  <Dropdowns
    label="سن"
    name="ageRange"
    value={ageRange}
    onChange={handleChange}
    options={ages}
  />
);
const AgeToDropdown = ({ ageRange, handleChange, ages }) => (
  <Dropdowns
    label="سن تا"
    name="ageTo"
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

const CarValuesDropdown = ({ carValue, handleChange, carValueOptions }) => (
  <Dropdowns
    label="ارزش خودرو"
    name="carValue"
    value={carValue}
    onChange={handleChange}
    options={carValueOptions}
  />
);
const IncomeAmountDropDown = ({ incomeAmount, handleChange, incomeAmounts }) => (
  <Dropdowns
    label="میزان درآمد ماهانه"
    name="incomeAmount"
    value={incomeAmount}
    onChange={handleChange}
    options={incomeAmounts}
  />
);

const OnlineStatusDropDown = ({ onlineStatus, handleChange, onlineStatuss }) => (
  <Dropdowns
    label="وضعیت آنلاین"
    name="onlineStatus"
    value={onlineStatus}
    onChange={handleChange}
    options={onlineStatuss}
  />
);
const ProfilePhotoStatusDropDown = ({ profilePhotoStatus, handleChange, profilePhotoStatuss }) => (
  <Dropdowns
    label="تصویر پروفایل"
    name="profilePhoto"
    value={profilePhotoStatus}
    onChange={handleChange}
    options={profilePhotoStatuss}
  />
);
const HomeValueDropDown = ({ homeValue, handleChange, homeValues }) => (
  <Dropdowns
    label="ارزش خانه"
    name="homeValue"
    value={homeValue}
    onChange={handleChange}
    options={homeValues}
  />
); 
const RelationTypeDropDown = ({ relationType, handleChange,relationTypes }) => (
  <Dropdowns
    label="نوع ارتباط مورد نظر"
    name="relationType"
    value={relationType}
    onChange={handleChange}
    options={relationTypes}
  />
); 

const GhadDropDown = ({ values, handleChange,options }) => (
  <Dropdowns
    label="قد"
    name="ghad"
    value={values}
    onChange={handleChange}
    options={options}
  />
); 

const VaznDropDown = ({ values, handleChange,options }) => (
  <Dropdowns
    label="وزن"
    name="vazn"
    value={values}
    onChange={handleChange}
    options={options}
  />
); 

const TipDropDown = ({ values, handleChange,options }) => (
  <Dropdowns
    label="تیپ - 5 بیشترین"
    name="tipNumber"
    value={values}
    onChange={handleChange}
    options={options}
  />
); 

const ZibaeeDropDown = ({ values, handleChange,options }) => (
  <Dropdowns
    label="زیبایی - 1 کمترین"
    name="zibaeeNumber"
    value={values}
    onChange={handleChange}
    options={options}
  />
); 

const CheildCountDropDown = ({ values, handleChange,options }) => (
  <Dropdowns
    label="تعداد فرزندان"
    name="cheildCount"
    value={values}
    onChange={handleChange}
    options={options}
  />
);
 const MaxCheildCountDropDown = ({ values, handleChange,options }) => (
  <Dropdowns
    label="حداکثر تعداد فرزندان"
    name="cheildCount"
    value={values}
    onChange={handleChange}
    options={options}
  />
); 

const RangePoostDropDown = ({ values, handleChange,options }) => (
  <Dropdowns
    label="رنگ پوست"
    name="rangePoost"
    value={values}
    onChange={handleChange}
    options={options}
  />
); 

const FirstCheildAgeDown = ({ values, handleChange,options }) => (
  <Dropdowns
    label="سن فرزند اول"
    name="firstCheildAge"
    value={values}
    onChange={handleChange}
    options={options}
  />
); 

export {
  GenderDropdown,
  AgeFromDropdown,
  AgeToDropdown,
  ProvinceDropdown,
  HealtStatusDropdown,
  LiveTypeDropdown,
  MarriageStatusDropdown,
  CarValuesDropdown,
  HomeValueDropDown,
  IncomeAmountDropDown,
  OnlineStatusDropDown,
  ProfilePhotoStatusDropDown,
  RelationTypeDropDown,
  AgeRangeDropdown,
  GhadDropDown,
  VaznDropDown,
  TipDropDown,
  ZibaeeDropDown,
  CheildCountDropDown,
  RangePoostDropDown,
  FirstCheildAgeDown,
  MaxCheildCountDropDown
};
