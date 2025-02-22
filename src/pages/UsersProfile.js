import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserInfo, blockUser, favoriteUser } from "../api"; // اطمینان حاصل کنید که مسیر درست است
import { Card, CardContent, Typography, Avatar, Button, Box, Alert, IconButton } from "@mui/material";
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Profile = () => {
  const { stringId } = useParams(); // دریافت stringId از URL
  const [user, setUser] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [blockedMe, setBlockedMe] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId'); // مقدار مستقیم از localStorage
      setLoading(true);
      const response = await getUserInfo(stringId, userId);
      if (response?.statusCode === 789) {
        setBlockedMe(true);
      } else if (response?.isSuccess) {
        setUser(response.model);
        setBlocked(response.model.isBlocked);
        setIsFavorite(response.model.isFavorite);
      }
      setLoading(false);
    };
  
    fetchUserData();
  }, [stringId]); // حذف currentUserId از وابستگی‌ها
  
  const handleBlockToggle = async () => {
    if (user) {
      const inputModel = {
        CurrentUserId: localStorage.getItem('userId'), // مقدار Id کاربر فعلی
        DestinationUserId: user.id,
        SetIsBlock: !blocked, // تغییر وضعیت بلاک
      };

      const response = await blockUser(inputModel); // صدا زدن API

      if (response.isSuccess) {
        setBlocked(!blocked); // بروزرسانی وضعیت بلاک
      } else {
        // نمایش خطا در صورت نیاز
        console.error("Error while blocking/unblocking the user");
      }
    }
  };
  const handleFavoriteToggle = async () => {
    if (user) {
      const inputModel = {
        CurrentUserId: localStorage.getItem('userId'), // مقدار Id کاربر فعلی
        DestinationUserId: user.id,
        setIsFavorite: !isFavorite, // تغییر وضعیت بلاک
      };

      const response = await favoriteUser(inputModel); // صدا زدن API

      if (response.isSuccess) {
        setIsFavorite(!isFavorite); // بروزرسانی وضعیت بلاک
      } else {
        // نمایش خطا در صورت نیاز
        console.error("Error while blocking/unblocking the user");
      }
    }
  };

  if (loading) return <Typography sx={{ textAlign: "center", mt: 5 }}>در حال بارگذاری...</Typography>;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ maxWidth: 500, p: 3, borderRadius: "12px", boxShadow: 3 }}>
        {blockedMe ? (
          <Alert severity="error" sx={{ textAlign: "center", fontSize: "1.1rem" }}>
            این کاربر شما را بلاک کرده است
          </Alert>
        ) : (
          user && (
            <>

              <Avatar
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                alt="User Avatar"
                sx={{ width: 140, height: 140, mx: "auto", my: 2 }}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold">

                  {user.firstName} {user.lastName}

                </Typography>

                {/* درباره من */}
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: 2,
                    mt: 2,
                    mb: 2,
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    درباره من
                  </Typography>
                  <Typography sx={{ mt: 1 }}>{user.myDescription}</Typography>
                </Box>

                {/* خصوصیات پارتنر مورد نظر */}
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: 2,
                    mb: 2,
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    درباره پارتنر مورد نظر
                  </Typography>
                  <Typography sx={{ mt: 1 }}>{user.rDescription}</Typography>
                </Box>

                <Typography sx={{ mt: 2 }}>📅 تاریخ تولد: {user.birthDate.split("T")[0]}</Typography>
                <Typography>🎂 سن: {user.age} سال</Typography>
                <Typography>💙 وضعیت سلامت: {user.healthStatus}</Typography>
                <Typography>🏡 نوع زندگی: {user.liveType}</Typography>
                <Typography>❤️ وضعیت تأهل: {user.marriageStatus}</Typography>
                <Typography>📍 استان: {user.province}</Typography>
                <Typography>💰 درآمد: {user.incomeAmount}</Typography>
                <Typography>🚗 ارزش خودرو: {user.carValue}</Typography>
                <Typography>🏠 ارزش خانه: {user.homeValue}</Typography>
                <Typography>🕒 آخرین فعالیت: {user.lastActivityDate.split("T")[0]}</Typography>
                <Typography>🤝 نوع رابطه مورد نظر: {user.relationType}</Typography>

                <Button
                  variant="contained"
                  color={blocked ? "secondary" : "primary"} // تغییر رنگ دکمه بر اساس وضعیت بلاک
                  onClick={handleBlockToggle}
                  sx={{ mt: 3 }}
                  fullWidth
                >
                  {blocked ? "از بلاک خارج کن" : "بلاک کن"} {/* متن دکمه بر اساس وضعیت بلاک */}
                </Button>


                <Link to={`/chat/${user.id}`}>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
                    شروع گفتگو
                  </Button>
                </Link>
                <IconButton
                  onClick={handleFavoriteToggle}
                  sx={{ mt: 3, color: isFavorite ? "error.main" : "inherit" }} // رنگ آیکن بر اساس وضعیت
                >
                  {isFavorite ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />} {/* آیکن قلب */}
                </IconButton>


              </CardContent>
            </>
          )
        )}
      </Card>
    </Box>
  );
};

export default Profile;
