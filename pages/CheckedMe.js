import Head from 'next/head';

import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid, Box } from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Alert, CardActionArea } from '@mui/material';

import { LastUsersCheckedMeApi, getDefaultAvatarAddress, getUserProfilePhoto } from './api';

const LastUsersCheckedMe = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("شروع فراخوانی API...");
        const response = await LastUsersCheckedMeApi();
        console.log("پاسخ API:", response);
        if (response && response.model) {
          setResults(response.model);
        } else {
          setError("داده‌ای از سرور دریافت نشد.");
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setError(error.message || "خطایی در دریافت داده‌ها رخ داد.");
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ padding: 2 }} dir="rtl">
      <meta
        name="همسریابی"
        content="دوست یابی | همسریابی | همسریار"
      />
      <Head>
        <title>همسر یابی همسریار</title>
      </Head>

      <h2 style={{ textAlign: 'center' }}>آخرین بازدیدکنندگان شما</h2>

      {error && <Alert severity="error">{error}</Alert>}

      {/* نمایش نتایج جستجو */}
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {Array.isArray(results) && results.length > 0 ? (
          results.map((user) => (
            <Grid item xs={12} sm={6} md={3} key={user.id}>
              <Card sx={{ margin: 1, bgcolor: "rgb(255, 0, 251)" }}>
                <Link legacyBehavior href={`/profile/${user.id}`} passHref>
                  <a style={{ textDecoration: 'none' }} target='_blank' rel='noopener noreferrer'>

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
                          image={getUserProfilePhoto(user.id)}
                          alt="همسریابی | دوستیابی | همسریار"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getDefaultAvatarAddress(user.genderId);
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
                  </a>
                </Link>
                <CardContent>
                  <Link legacyBehavior href={`/profile/${user.id}`} passHref>
                    <a style={{ textDecoration: 'none' }} target='_blank' rel='noopener noreferrer'>
                      <Typography variant="h6">
                        <br />
                        {user.firstName}
                        <br /> {user.age} {" "} ساله از {" "} {user.province}
                      </Typography>
                    </a>
                  </Link>

                  {user.marriageStatus} {" - "} {user.liveType}

                  <Typography variant="body2" color="textSecondary">
                    میزان درآمد {user.incomeAmount}
                    <br />
                    نوع رابطه مورد نظر : {user.relationType}
                    <br />
                    آخرین فعالیت {user.lastActivityDate}
                    <br />
                    زمان مشاهده پروفایل شما : {user.activityDate}
                  </Typography>
                  <Link legacyBehavior href={`/chat/${user.id}`} passHref>
                    <a style={{ textDecoration: 'none' }} target='_blank' rel='noopener noreferrer'>
                 
                    <Button variant="contained" color="primary" sx={{ mt: 3 }} fullWidth>
                      شروع گفتگو
                    </Button>
                    </a>
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
    </Box>
  );
};

export default LastUsersCheckedMe;