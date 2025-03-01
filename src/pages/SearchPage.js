import React, { useState, useEffect, useRef } from 'react';
import {
  TextField, MenuItem, Select, InputLabel, FormControl,
  Button, Grid, Box
} from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Alert, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import { searchUsers, getDropdownItems } from '../api';
import { LastUsersCheckedMeApi, getDefaultAvatarAddress, getUserProfilePhoto } from '../api'; 

import {
  AgeFromDropdown, AgeToDropdown, ProvinceDropdown,
  HealtStatusDropdown, LiveTypeDropdown, MarriageStatusDropdown,
  CarValuesDropdown, HomeValueDropDown, IncomeAmountDropDown,
  OnlineStatusDropDown, ProfilePhotoStatusDropDown, RelationTypeDropDown
} from './registerPage/Dropdowns';

const SearchPage = () => {
  const [formData, setFormData] = useState({
    ageFrom: '', ageTo: '', province: '', healtStatus: '', liveType: '', marriageStatus: '',
    incomeAmount: '', homeValue: '', carValue: '', onlineStatus: '', profilePhoto: '', relationType: ''
  });

  const [dropdownData, setDropdownData] = useState({
    ageTo: [], ageFrom: [], healtStatus: [], liveTypes: [], marriageStatus: [], provinces: [],
    incomeAmount: [], homeValue: [], carValue: [], onlineStatus: [], profilePhoto: [], relationType: []
  });

  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [profilePhotos, setProfilePhotos] = useState({}); // ✅ ذخیره عکس‌ها برای جلوگیری از فراخوانی‌های تکراری
  const observer = useRef();

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchMoreResults = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const requestData = {
        pageIndex: pageIndex + 1,
        pageItemsCount: 10,
        ageIdFrom: formData.ageFrom ? parseInt(formData.ageFrom) : 0,
        ageIdTo: formData.ageTo ? parseInt(formData.ageTo) : 0,
        CurrentUserId: localStorage.getItem('userId'),
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
      if (response.data.statusCode === 200) {
        const newResults = response.data.model || [];

        if (newResults.length === 0) { 
          setHasMore(false);
          observer.current.disconnect();
        } else {
          setResults((prev) => [...prev, ...newResults]);
          setPageIndex((prev) => prev + 1);

          // ✅ دریافت عکس‌ها فقط برای کاربران جدید
          const newProfilePhotos = {};
          newResults.forEach(user => {
            newProfilePhotos[user.id] = getUserProfilePhoto(user.id);
          });
          setProfilePhotos(prev => ({ ...prev, ...newProfilePhotos }));
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreResults();
      }
    });
    if (observer.current && document.getElementById('scroll-end')) {
      observer.current.observe(document.getElementById('scroll-end'));
    }
    return () => observer.current && observer.current.disconnect();
  }, [results]);

  const defaultAvatar = getDefaultAvatarAddress();

  return (
    <Box sx={{ padding: 2 }} dir="rtl">
      <h2 style={{ textAlign: 'center' }}>جستجوی کاربران</h2>
      <Grid container spacing={2}>
        {results.length > 0 ? (
          results.map((user) => (
            <Grid item xs={12} sm={6} md={3} key={user.id}>
              <Card sx={{ margin: 1 }}>
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
                        image={profilePhotos[user.id] || defaultAvatar} // ✅ استفاده از state برای جلوگیری از فراخوانی مجدد
                        alt="User Avatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultAvatar;
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
                  <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
                  <Typography variant="body2">{user.age} ساله از {user.province}</Typography>
                  <Link to={`/chat/${user.id}`}>
                    <Button variant="contained" color="primary" fullWidth>شروع گفتگو</Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", width: "100%", marginTop: 2 }}>
            هیچ نتیجه‌ای یافت نشد.
          </Typography>
        )}
      </Grid>
      <div id="scroll-end" style={{ height: 10 }}></div>
      {loading && <Typography textAlign="center">در حال بارگذاری...</Typography>}
    </Box>
  );
};

export default SearchPage;
