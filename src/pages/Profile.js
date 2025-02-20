import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserInfo } from "../api"; // مطمئن شوید که مسیر درست است
import { Card, CardContent, Typography, Avatar, Button, Box, Alert } from "@mui/material";
import { Link } from 'react-router-dom';

const Profile = () => {
  const { stringId } = useParams(); // دریافت stringId از URL
  const [user, setUser] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const response = await getUserInfo(stringId);

      if (response?.statusCode === 789) {
        setBlocked(true);
      } else if (response?.isSuccess) {
        setUser(response.model);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [stringId]);

  if (loading) return <Typography sx={{ textAlign: "center", mt: 5 }}>در حال بارگذاری...</Typography>;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ maxWidth: 500, p: 3, borderRadius: "12px", boxShadow: 3 }}>
        {blocked ? (
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

                <Link to={`/chat/${user.id}`}>
                <Button variant="contained" color="primary" sx={{ mt: 3 }} fullWidth>
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

export default Profile;
