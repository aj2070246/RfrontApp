import { isDevelopMode, hamYab, hamYar, doostYab, hamType, } from '../api';
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserInfo, blockUser, favoriteUser, getUserProfilePhoto, getDefaultAvatarAddress } from "../api"; // اطمینان حاصل کنید که مسیر درست است
import {
  Card, CardContent, Typography, Button, Box, IconButton
  , CardMedia, Alert, CardActionArea
} from "@mui/material";
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { FaBan, FaUnlock } from "react-icons/fa";

const Profile = () => {
  const { stringId } = useParams(); // دریافت stringId از URL
  const currentUserId = localStorage.getItem('userId'); // گرفتن userId کاربر جاری
  const isOwnProfile = stringId === currentUserId; // بررسی اینکه پروفایل برای خود کاربر است
  const [user, setUser] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [blockedMe, setBlockedMe] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null); // حالت برای عکس پروفایل
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      console.log('Photo URL=========== photoUrl', stringId);
      if (stringId) {
        const photoUrl = await getUserProfilePhoto(stringId);
        console.log('Photo URL:::::::::::', photoUrl); // چک کن چی برگشته
        setProfilePhoto(photoUrl);
      }
    };
    fetchProfilePhoto();
  }, [stringId]);
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

  if (loading) return
  <Typography sx={{ textAlign: "center", mt: 5 }}>در حال بارگذاری...</Typography>;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>

      <HelmetProvider>
        <Helmet>
          <title>{hamYab()} | {hamYar()}</title>
        </Helmet>
      </HelmetProvider>


      <Card sx={{ maxWidth: 500, p: 3, borderRadius: "12px", boxShadow: 3 }}>
        {isOwnProfile && (
          <Alert severity="info" sx={{ textAlign: "center", fontSize: "1.1rem", mb: 2 }}>
            پروفایل شما از نگاه دیگران به این صورت است
          </Alert>
        )}
        {blockedMe ? (
          <Alert severity="error" sx={{ textAlign: "center", fontSize: "1.1rem" }}>
            این کاربر شما را بلاک کرده است
          </Alert>
        ) : (
          user && (
            <>


              <CardActionArea>
                <Box
                  sx={{
                    position: "relative",
                    height: 140, // ارتفاع ثابت
                    width: "100%", // عرض کارت را پر کند
                    backgroundColor: "pink",
                    overflow: "hidden", // جلوگیری از نمایش اضافی
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >

                  <img
                    src={profilePhoto}
                    alt="Profile"
                    style={{
                      maxHeight: "100%", // جلوگیری از بزرگ‌تر شدن از کادر
                      maxWidth: "100%", // جلوگیری از بزرگ‌تر شدن از کادر
                      objectFit: "contain", // تصویر را متناسب نگه می‌دارد
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      const genderId = localStorage.getItem("genderId");
                      console.log("-------genderId-------------", genderId);
                      e.target.src = getDefaultAvatarAddress(user.genderId);
                    }}
                  />

                </Box>
              </CardActionArea>

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
                  <Typography
                    sx={{
                      mt: 1,
                      maxHeight: "6.8em", // محدود کردن به 4 خط
                      overflowY: "auto", // اضافه کردن اسکرول در صورت بلند بودن متن
                      display: "-webkit-box",
                      WebkitLineClamp: 6, // نمایش حداکثر 4 خط
                      WebkitBoxOrient: "vertical",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal", // حفظ ساختار متن
                      wordBreak: "break-word", // شکستن کلمات طولانی
                      overflowWrap: "break-word", // جلوگیری از خروج کلمات بلند از عرض
                    }}
                  >
                    {user.myDescription}
                  </Typography>


                </Box>

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
                  <Typography
                    sx={{
                      mt: 1,
                      maxHeight: "6.8em", // محدود کردن به 4 خط
                      overflowY: "auto", // اضافه کردن اسکرول در صورت بلند بودن متن
                      display: "-webkit-box",
                      WebkitLineClamp: 6, // نمایش حداکثر 4 خط
                      WebkitBoxOrient: "vertical",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal", // حفظ ساختار متن
                      wordBreak: "break-word", // شکستن کلمات طولانی
                      overflowWrap: "break-word", // جلوگیری از خروج کلمات بلند از عرض
                    }}
                  >
                    {user.rDescription}
                  </Typography>

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

                <Typography>📏 قد: {user.ghad}</Typography>
                <Typography>⚖️ وزن: {user.vazn}</Typography>
                <Typography>👶 تعداد فرزندان: {user.cheildCount}</Typography>
                <Typography>👦 سن فرزند بزرگتر: {user.firstCheildAge}</Typography>
                <Typography>🌕 رنگ پوست: {user.rangePoost}</Typography>
                <Typography>💄 میزان زیبایی: {user.zibaeeNumber}</Typography>
                <Typography>🧑‍🦱 میزان خوش تیپی: {user.tipNUmber}</Typography>

                {!isOwnProfile && (

                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 3 }}>

                    {/* دکمه بلاک */}
                    <IconButton
                      onClick={handleBlockToggle}
                      sx={{ color: blocked ? "green" : "red" }}
                      title={blocked ? "عدم مسدود سازی" : "مسدود سازی"} // متن هنگام Hover
                    >
                      {blocked ? <FaUnlock style={{ fontSize: "2.5rem" }} /> : <FaBan style={{ fontSize: "2.5rem" }} />}
                    </IconButton>

                    {/* دکمه علاقه‌مندی */}
                    <IconButton
                      onClick={handleFavoriteToggle}
                      sx={{ color: isFavorite ? "error.main" : "inherit" }}
                      title={isFavorite ? "حذف از علاقه‌مندی‌ها" : "اضافه به علاقه‌مندی‌ها"} // متن هنگام Hover
                    >
                      {isFavorite ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
                    </IconButton>

                  </Box>

                )}
                <Link to={`/chat/${user.id}`}>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth>
                    شروع گفتگو
                  </Button>
                </Link>

              </CardContent>
            </>
          )
        )}
      </Card>
    </Box>
  );
};

const styles = {
  profileImage: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '10px',
  },
};
export default Profile;
