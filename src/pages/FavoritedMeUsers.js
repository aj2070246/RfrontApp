import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid, Box } from '@mui/material';
import { Card, CardContent, CardMedia, Typography, Alert, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import { FavoritedMeUsersApi ,getDefaultAvatarAddress,getUserProfilePhoto} from '../api'; // اضافه کردن متد جدید

const FavoritedMeUsers = () => {
  const [results, setResults] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const defaultAvatar = getDefaultAvatarAddress();

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
      <h2 style={{ textAlign: 'center' }}>این کاربران شما در مورد علاقه ها دارند</h2>

      {error && <Alert severity="error">{error}</Alert>}

      {/* نمایش نتایج جستجو */}
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {Array.isArray(results) && results.length > 0 ? (
          results.map((user) => (
            <Grid item xs={12} sm={6} md={3} key={user.id}>
              <Card sx={{ margin: 1, bgcolor: "rgb(255, 0, 251)" }}> {/* رنگ پس‌زمینه کارد */}
                <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none' }} target='_blank'>
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
                        alt="User Avatar"
                        onError={(e) => {
                          e.target.onerror = null; // جلوگیری از حلقه بی‌پایان
                          e.target.src = defaultAvatar; // نمایش عکس پیش‌فرض
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
                </Link>
                <CardContent>
                  <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none' }} target='_blank'>
                    <Typography variant="h6">
                      {user.firstName} {user.lastName}
                      <br />    {user.age} {" "} ساله از  {" "}{user.province}
                    </Typography>
                  </Link>

                  {user.marriageStatus}{" - "}{user.liveType}

                  <Typography variant="body2" color="textSecondary">
                    میزان درآمد    {user.incomeAmount}
                    <br />
                    نوع رابطه مورد نظر  :  {user.relationType}
                    <br />
                    آخرین فعالیت  {user.lastActivityDate}
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

export default FavoritedMeUsers;
