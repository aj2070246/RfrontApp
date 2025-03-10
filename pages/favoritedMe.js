import Link from 'next/link';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid, Box } from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Alert, CardActionArea } from '@mui/material';
import { FavoritedMeUsersApi, getDefaultAvatarAddress, getUserProfilePhoto } from './api'; // اضافه کردن متد جدید

const FavoritedMeUsers = () => {
  const [results, setResults] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await FavoritedMeUsersApi();
        setResults(response.model);
      } catch (error) {
        console.error('❌ Error fetching dropdown data:', error);
        setError(error.message);
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
      <h2 style={{ textAlign: 'center' }}>این کاربران شما در مورد علاقه ها دارند</h2>

      {error && <Alert severity="error">{error}</Alert>}

      {/* نمایش نتایج جستجو */}
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {Array.isArray(results) && results.length > 0 ? (
          results.map((user) => (
            <Grid item xs={12} sm={6} md={3} key={user.id}>
              <Card sx={{ margin: 1, bgcolor: "rgb(255, 0, 251)" }}> {/* رنگ پس‌زمینه کارد */}
                <Link legacyBehavior href={`/profile/${user.id}`} passHref>
                  <a style={{ textDecoration: 'none' }} target='_blank' rel='noopener noreferrer'>

                    <CardActionArea>
                      <Box
                        sx={{
                          position: "relative",
                          height: 140, // ارتفاع ثابت
                          width: "100%", // پر کردن عرض کارت
                          backgroundColor: "pink", // رنگ پس‌زمینه قرمز
                          overflow: "hidden", // جلوگیری از نمایش اضافی
                        }}
                      >

                        <CardMedia
                          component="img"
                          image={getUserProfilePhoto(user.id)}
                          alt="همسریابی | دوستیابی | همسریار"
                          onError={(e) => {
                            e.target.onerror = null; // جلوگیری از حلقه بی‌پایان
                            e.target.src = getDefaultAvatarAddress(user.genderId); // نمایش عکس پیش‌فرض
                          }}
                          sx={{
                            height: "100%", // پر کردن ارتفاع
                            width: "100%", // پر کردن عرض کارت
                            objectFit: "contain", // برش تصویر در صورت نیاز
                            position: "absolute", // قرارگیری در بالای Box
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
                      {/* محتویات لینک */}
                      <Typography variant="h6">
                        {user.firstName}
                        <br />    {user.age} {" "} ساله از  {" "}{user.province}
                      </Typography>
                    </a>

                  </Link>

                  {user.marriageStatus}{" - "}{user.liveType}

                  <Typography variant="body2" color="textSecondary">
                    میزان درآمد    {user.incomeAmount}
                    <br />
                    نوع رابطه مورد نظر  :  {user.relationType}
                    <br />
                    آخرین فعالیت  {user.lastActivityDate}
                  </Typography>
                  <Link legacyBehavior href={`/profile/${user.id}`} passHref>
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

export default FavoritedMeUsers;
