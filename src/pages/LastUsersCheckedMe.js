import { isDevelopMode, hamYab, hamYar, doostYab, hamType } from '../api';
import { HelmetProvider, Helmet } from "react-helmet-async";
import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid, Box } from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Alert, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import { LastUsersCheckedMeApi, getDefaultAvatarAddress, getUserProfilePhoto } from '../api';

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
      <HelmetProvider>
        <Helmet>
          <title>{hamYab()} | {hamYar()}</title>
        </Helmet>
      </HelmetProvider>

      <h2 style={{ textAlign: 'center' }}>آخرین بازدیدکنندگان شما</h2>

      {error && <Alert severity="error">{error}</Alert>}

      {/* نمایش نتایج جستجو */}
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {Array.isArray(results) && results.length > 0 ? (
          results.map((user) => (
            <Grid item xs={12} sm={6} md={3} key={user.id}>
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
                        image={getUserProfilePhoto(user.id)}
                        alt="User Avatar"
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
                </Link>
                <CardContent>
                  <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none' }} target='_blank'>
                    <Typography variant="h6">
                      <br />
                      {user.firstName} 
                      <br /> {user.age} {" "} ساله از {" "} {user.province}
                    </Typography>
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
    </Box>
  );
};

export default LastUsersCheckedMe;