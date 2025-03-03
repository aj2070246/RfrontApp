import React, { useState, useEffect, useRef } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid, Box } from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Alert, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import { searchUsers, getDropdownItems, getUserProfilePhoto,getDefaultAvatarAddress } from '../api';
import {
  AgeFromDropdown, AgeToDropdown, ProvinceDropdown,
  HealtStatusDropdown, LiveTypeDropdown, MarriageStatusDropdown,
  CarValuesDropdown, HomeValueDropDown, IncomeAmountDropDown,
  OnlineStatusDropDown, ProfilePhotoStatusDropDown, RelationTypeDropDown
} from './registerPage/Dropdowns';

const SearchPage = () => {
  const [formData, setFormData] = useState({
    ageFrom: '',
    ageTo: '',
    province: '',
    healtStatus: '',
    liveType: '',
    marriageStatus: '',
    incomeAmount: '',
    homeValue: '',
    carValue: '',
    onlineStatus: '',
    profilePhoto: '',
    relationType: ''
  });
  const [dropdownVisible, setDropdownVisible] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1); // از 1 شروع می‌شه
  const [loading, setLoading] = useState(false); // برای مدیریت لودینگ
  const [hasMore, setHasMore] = useState(true); // چک کردن اینکه آیا داده بیشتری هست یا نه
  const [searchInitiated, setSearchInitiated] = useState(false); // آیا جستجو با دکمه شروع شده؟
  const observer = useRef(); // برای IntersectionObserver
  const lastElementRef = useRef(); // برای ردیابی آخرین المنت

  // ذخیره عکس پروفایل برای هر کاربر
  const [profilePhotos, setProfilePhotos] = useState({});

  // داده‌های دراپ‌داون‌ها
  const [dropdownData, setDropdownData] = useState({
    ageTo: [],
    ageFrom: [],
    healtStatus: [],
    liveTypes: [],
    marriageStatus: [],
    provinces: [],
    incomeAmount: [],
    homeValue: [],
    carValue: [],
    onlineStatus: [],
    profilePhoto: [],
    relationType: []
  });

  // گرفتن داده‌های دراپ‌داون‌ها
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dropdownResponse = await getDropdownItems();
        if (dropdownResponse.data.isSuccess) {
          setDropdownData({
            ageFrom: dropdownResponse.data.model.ages || [],
            ageTo: dropdownResponse.data.model.ages || [],
            healtStatus: dropdownResponse.data.model.healtStatus || [],
            liveTypes: dropdownResponse.data.model.liveTypes || [],
            marriageStatus: dropdownResponse.data.model.marriageStatus || [],
            provinces: dropdownResponse.data.model.provinces || [],
            incomeAmount: dropdownResponse.data.model.incomeAmount || [],
            carValue: dropdownResponse.data.model.carValue || [],
            homeValue: dropdownResponse.data.model.homeValue || [],
            onlineStatus: dropdownResponse.data.model.onlineStatus || [],
            profilePhoto: dropdownResponse.data.model.profilePhoto || [],
            relationType: dropdownResponse.data.model.relationType || [],
          });
        }
      } catch (error) {
        console.error('❌ Error fetching dropdown data:', error);
      }
    };
    fetchData();
  }, []);

  // گرفتن عکس‌ها برای کاربران
  useEffect(() => {
    const fetchProfilePhotos = async () => {
      const newPhotos = {};
      for (const user of results) {
        if (!profilePhotos[user.id]) {
          const photoUrl = await getUserProfilePhoto(user.id);
          newPhotos[user.id] = photoUrl;
        }
      }
      setProfilePhotos((prev) => ({ ...prev, ...newPhotos }));
    };
    if (results.length > 0) {
      fetchProfilePhotos();
    }
  }, [results]);

  // مدیریت اسکرول با IntersectionObserver
  useEffect(() => {
    if (loading || !hasMore || !searchInitiated) return; // فقط وقتی جستجو با دکمه شروع شده باشه

    const currentObserver = observer.current;
    if (currentObserver) currentObserver.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && searchInitiated) {
        setPageIndex((prev) => prev + 1);
      }
    });

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (currentObserver) currentObserver.disconnect();
    };
  }, [loading, hasMore, searchInitiated]);

  // گرفتن نتایج با تغییر pageIndex
  useEffect(() => {
    if (pageIndex > 1 && searchInitiated) { // فقط وقتی جستجو شروع شده باشه
      handleSearch(false); // false یعنی append کنیم نه reset
    }
  }, [pageIndex]);

  // جستجوی اولیه موقع لود صفحه
  useEffect(() => {
    handleSearch(true, false); // reset=true, hideDropdowns=false
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (reset = true, hideDropdowns = true) => {
    setLoading(true);
    try {
      setError(null);

      const requestData = {
        pageIndex: reset ? 1 : pageIndex, // اگه reset باشه از 1 شروع کن، وگرنه pageIndex فعلی
        pageItemsCount: 10,
        ageIdFrom: formData.ageFrom ? parseInt(formData.ageFrom) : 0,
        ageIdTo: formData.ageTo ? parseInt(formData.ageTo) : 0,
        userId: localStorage.getItem('userId'),
        healthStatusId: formData.healtStatus ? parseInt(formData.healtStatus) : 0,
        liveTypeId: formData.liveType ? parseInt(formData.liveType) : 0,
        marriageStatusId: formData.marriageStatus ? parseInt(formData.marriageStatus) : 0,
        provinceId: formData.province ? parseInt(formData.province) : 0,
        incomeId: formData.incomeAmount ? parseInt(formData.incomeAmount) : 0,
        carValueId: formData.carValue ? parseInt(formData.carValue) : 0,
        homeValueId: formData.homeValue ? parseInt(formData.homeValue) : 0,
        profilePhotoId: formData.profilePhoto ? parseInt(formData.profilePhoto) : 0,
        onlineStatusId: formData.onlineStatus ? parseInt(formData.onlineStatus) : 0,
        relationTypeId: formData.relationType ? parseInt(formData.relationType) : 0,
      };

      const response = await searchUsers(requestData);

      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'خطایی رخ داده است');
      }

      const newResults = response.data.model || [];
      if (reset) {
        setResults(newResults); // نتایج قبلی رو کامل پاک کن و از نو شروع کن
        setPageIndex(1); // صفحه به 1 برگرده
        setHasMore(true); // دوباره اجازه اسکرول بده
        setSearchInitiated(true); // جستجو با دکمه شروع شده
      } else {
        setResults((prev) => [...prev, ...newResults]); // فقط append کن
      }

      // اگه هیچ نتیجه‌ای نبود یا تعداد نتایج کمتر از 10 بود، دیگه داده بیشتری نیست
      if (newResults.length === 0 || newResults.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true); // فقط وقتی داده جدید هست اجازه اسکرول بده
      }

      if (hideDropdowns) setDropdownVisible(false); // فقط وقتی hideDropdowns=true باشه دراپ‌داون رو ببند
    } catch (err) {
      setError(err.message);
      if (reset) {
        setResults([]); // نتایج قبلی رو پاک کن
        setPageIndex(1); // صفحه به 1 برگرده
        setHasMore(true); // دوباره اجازه اسکرول بده
        setSearchInitiated(true); // جستجو با دکمه شروع شده
      }
      setHasMore(false); // اگه خطا گرفت، دیگه اسکرول نکنه
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <Box sx={{ padding: 2 }} dir="rtl">
      <h2 style={{ textAlign: 'center' }}>جستجوی کاربران</h2>
      {!dropdownVisible && (
        <Box
          sx={{
            backgroundColor: "#ddd",
            padding: "10px",
            textAlign: "center",
            cursor: "pointer",
            marginTop: "10px",
            borderRadius: "5px"
          }}
          onClick={() => setDropdownVisible(prev => !prev)}
        >
          {dropdownVisible ? "بستن فیلترها ❌" : "نمایش فیلترها 🔍"}
        </Box>
      )}

      {dropdownVisible && (
        <Grid container spacing={2}>
          <AgeToDropdown ageRange={formData.ageTo} handleChange={handleChange} ages={dropdownData.ageTo} />
          <AgeFromDropdown ageRange={formData.ageFrom} handleChange={handleChange} ages={dropdownData.ageFrom} />
          <ProvinceDropdown province={formData.province} handleChange={handleChange} provinces={dropdownData.provinces} />
          <HealtStatusDropdown healtStatus={formData.healtStatus} handleChange={handleChange} healtStatusOptions={dropdownData.healtStatus} />
          <LiveTypeDropdown liveType={formData.liveType} handleChange={handleChange} liveTypes={dropdownData.liveTypes} />
          <MarriageStatusDropdown marriageStatus={formData.marriageStatus} handleChange={handleChange} marriageStatusOptions={dropdownData.marriageStatus} />
          <RelationTypeDropDown relationType={formData.relationType} handleChange={handleChange} onlineStatuss={dropdownData.relationType} />
          <HomeValueDropDown homeValue={formData.homeValue} handleChange={handleChange} homeValues={dropdownData.homeValue} />
          <CarValuesDropdown carValue={formData.carValue} handleChange={handleChange} carValueOptions={dropdownData.carValue} />
          <IncomeAmountDropDown incomeAmount={formData.incomeAmount} handleChange={handleChange} incomeAmounts={dropdownData.incomeAmount} />
          <ProfilePhotoStatusDropDown profilePhotoStatus={formData.profilePhoto} handleChange={handleChange} profilePhotoStatuss={dropdownData.profilePhoto} />
          <OnlineStatusDropDown onlineStatus={formData.onlineStatus} handleChange={handleChange} onlineStatuss={dropdownData.onlineStatus} />
        </Grid>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" fullWidth onClick={() => handleSearch(true, true)}>
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
            results.map((user, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={user.id}
                ref={index === results.length - 1 ? lastElementRef : null} // آخرین المنت رو ردیابی کن
              >
                <Card sx={{ margin: 1, bgcolor: "rgb(255, 0, 251)" }}>
                  <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none' }} target='_blank'>
                    <CardActionArea>
                      <Box
                        sx={{
                          position: "relative",
                          height: 140,
                          width: "100%",
                          backgroundColor: "pink",
                          overflow: "hidden",
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={profilePhotos[user.id] } // استفاده از state برای عکس
                          alt="User Avatar"
                          onError={(e) => {
                            e.target.onerror = null;
                            console.log('error avatar search', user.genderId);
                            e.target.src =  getDefaultAvatarAddress(user.genderId);
                          }}
                          sx={{
                            height: "100%",
                            width: "100%",
                            objectFit: "contain",
                            position: "absolute",
                            top: 0,
                            left: 0,
                          }}
                        />
                      </Box>
                    </CardActionArea>
                  </Link>
                  <CardContent>
                    <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none' }} target='_blank'>
                      <Typography variant="h6">
                        {user.firstName} {user.lastName}
                        <br /> {user.age} {" "} ساله از {" "}{user.province}
                      </Typography>
                    </Link>
                    {user.marriageStatus}{" - "}{user.liveType}
                    <Typography variant="body2" color="textSecondary">
                      میزان درآمد {user.incomeAmount}
                      <br />
                      نوع رابطه مورد نظر: {user.relationType}
                      <br />
                      آخرین فعالیت {user.lastActivityDate}
                    </Typography>
                    <Link to={`/chat/${user.id}`}>
                      <Button variant="contained" color="primary" sx={{ mt: 3 }} fullWidth>
                        شروع گفتگو
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
        {loading && (
          <Grid item xs={12}>
            <Typography textAlign="center">در حال بارگذاری...</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SearchPage;