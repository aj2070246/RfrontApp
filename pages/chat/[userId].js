import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {SendReport, getDefaultAvatarAddress, getMessages, sendMessage, getUserInfo, deleteMessage, getUserProfilePhoto } from '../api';
import { Card, Box, Alert, Snackbar, Typography, IconButton } from "@mui/material";
import Head from 'next/head';

import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const ChatPage = () => {
  const router = useRouter();
  const { userId } = router.query; // دریافت پارامترهای مسیر

  const senderUserId = localStorage.getItem('userId');
  const [messages, setMessages] = useState([]);
  const [statusCode, setStatusCode] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [showStatusText, setShowStatusText] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [isSending, setIsSending] = useState(false); // وضعیت برای غیرفعال کردن دکمه

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const router = useRouter();

    const token = localStorage.getItem('token');
    if (!userId || !token) {
      console.warn("User ID or token is missing, redirecting to login...");
      // window.location.href = "/login";
      router.push('/login'); // مسیریابی به صفحه لاگین

      return;
    }
    if (userId && senderUserId) {
      fetchUserInfo();
      fetchMessages();
    }
  }, [userId, senderUserId]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      if (!userId || !senderUserId) {
        console.warn("User ID or senderUserId is missing, redirecting to login...");
        router.push('/login'); // مسیریابی به صفحه لاگین
        return;
      }
      const response = await getMessages(senderUserId, userId);
      if (response.data.isSuccess) {
        setStatusCode(response.data.statusCode);
        setMessages(response.data.model.reverse());
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const currentUserId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      console.log('Fetching user info with userId:', userId, 'currentUserId:', currentUserId, 'token:', token);

      if (!currentUserId || !token) {
        console.warn("Current user ID or token is missing, redirecting to login...");
        router.push('/login'); // مسیریابی به صفحه لاگین
        return;
      }

      const response = await getUserInfo(userId, currentUserId);
      if (response.isSuccess) {
        setUserInfo(response.model);
      } else {
        console.error('API response indicates failure:', response);
      }

      const photoUrl = await getUserProfilePhoto(userId);
      console.log('fetchProfilePhoto Photo URL:', photoUrl);

      console.log(photoUrl);
      setProfilePhoto(photoUrl || getDefaultAvatarAddress(response.model?.genderId || 0));
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleSendMessage = async () => {

    if (!newMessage.trim()) return;

    setIsSending(true);  // دکمه غیرفعال می‌شود


    try {
      await sendMessage(senderUserId, userId, newMessage);
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setIsSending(false);  // دکمه غیرفعال می‌شود

  };

  const handleMouseEnter = (statusId) => {
    setShowStatusText(statusId);
  };

  const handleMouseLeave = () => {
    setShowStatusText(null);
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await deleteMessage(messageId);
      if (response.data.isSuccess) {
        setMessages(messages.filter(msg => msg.id !== messageId));
        fetchMessages();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const SendReportToSitePolice = async () => {

    const userConfirmed = window.confirm("آیا از ارسال گزارش به پلیس سایت مطمئن هستید؟");
    if (userConfirmed) {

      const response = await SendReport(); // صدا زدن API

      if (response.isSuccess) {
        setSnackbar({ open: true, message: 'ضمن تشکر، گزارش شما ثبت شد و در اسرع وقت پیگیری میشود', severity: 'success' });

      } else {
        setSnackbar({ open: true, message: response.data.message, severity: 'error' });
        // نمایش خطا در صورت نیاز
        console.error("Error while blocking/unblocking the user");
      }
    }
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ maxWidth: 500, p: 3, borderRadius: "12px", boxShadow: 3 }}>

        <meta
          name="همسریابی"
          content="دوست یابی | همسریابی | همسریار"
        />
        <Head>
          <title>همسر یابی همسریار</title>
        </Head>

        <div style={styles.container}>
          {userInfo && (
            <Link to={`/profile/${userInfo.id}`} style={{ textDecoration: 'none' }} target='_blank'>
              <div style={styles.userInfoContainer}>
                <div style={styles.userDetails}>
                  <p style={styles.userName}>
                    پیام شخصی با <br />
                    {userInfo.firstName}
                  </p>
                  <p style={styles.userInfo}>شهر {" "}{userInfo.province}</p>
                  <p style={styles.userInfo}>آخرین فعالیت {" "}{userInfo.lastActivityDate}</p>
                  <p style={styles.userInfo}>رابطه مورد نظر {" "}{userInfo.relationType}</p>
                  <p style={styles.userInfo}>{userInfo.marriageStatus} | {userInfo.liveType}</p>
                </div>
                <img
                  src={profilePhoto || getDefaultAvatarAddress(userInfo.genderId || 0)}
                  alt="همسریابی | دوستیابی | همسریار"
                  style={styles.profileImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getDefaultAvatarAddress(userInfo.genderId || 0);
                  }}
                />
              </div>
            </Link>
          )}

          <div className="noMessages" style={styles.messagesContainer}>
            {statusCode === 6969 ? (
              <div className="noMessages">
                <h3>گفتگویی یافت نشد. برای شروع گفتگو،</h3>
                <h1>یک پیام ارسال کنید.</h1>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  onMouseEnter={() => msg.senderUserId === senderUserId && handleMouseEnter(msg.messageStatusId)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    ...styles.message,
                    backgroundColor: msg.senderUserId === senderUserId ? '#A97775' : '#2196F3',
                    width: '75%',
                    marginLeft: msg.senderUserId === senderUserId ? '25%' : '0',
                    marginRight: msg.senderUserId === senderUserId ? '0' : '25%',
                    alignSelf: msg.senderUserId === senderUserId ? 'flex-end' : 'flex-start',
                  }}
                >
                  <p style={styles.text}>{msg.messageText}</p>

                  {msg.senderUserId === senderUserId && (
                    <span style={styles.text}>
                      <span style={styles.time}>
                        {new Date(msg.sendDate).toLocaleString('fa-IR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        style={styles.deleteButton}
                      >
                        🗑️
                      </button>
                      {msg.messageStatusId === 1 ? '✔️' : msg.messageStatusId === 2 ? '✔️✔️' : ''}


                    </span>
                  )}
                  {msg.senderUserId === senderUserId && showStatusText === msg.messageStatusId && (
                    <div style={styles.statusText}>
                      <span style={{ color: '#000' }}>
                        {msg.messageStatusId === 1 ? 'ارسال شده' : msg.messageStatusId === 2 ? 'خوانده شده' : ''}
                      </span>
                    </div>
                  )}

                </div>
              ))
            )}
            <div ref={messagesEndRef} style={{ height: '0' }} />
          </div>
          {userId != senderUserId && userId != '431C6083-C662-46F6-84B0-348075ABF34FE1BD03DA-FC53-4F74-8CFB-75E4D88C89AE0AADB564-B794-4CFF-A26F-28F695D31850BDEB3154-F9CF-4893-ABBD-DDF5177288434122E12B-4D96-4651-99E4-7E2D444B5287' && (

            <>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="پیام خود را بنویسید..."
                  style={styles.input}
                />
                {!isSending && (
                  <button onClick={handleSendMessage} style={styles.button}>ارسال</button>
                )}
              </div>

              <IconButton
                onClick={SendReportToSitePolice}
                sx={{ color: "inherit" }}
                title="گزارش به پلیس سایت" // متن هنگام Hover
              >
                <ReportProblemIcon style={{ fontSize: "large" }} />
                <Typography> گزاش تخلف به پلیس سایت</Typography>
              </IconButton>

            </>
          )}
        </div>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Card>
    </Box>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  userInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    marginBottom: '10px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0,
  },
  userInfo: {
    fontSize: '14px',
    color: '#555',
    margin: '2px 0',
  },
  messagesContainer: {
    flexGrow: 1,
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '10px 0',
  },
  message: {
    maxWidth: '60%',
    padding: '10px',
    borderRadius: '10px',
    color: '#fff',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
  text: {
    margin: 0,
  },
  time: {
    fontSize: '12px',
    textAlign: 'right',
    marginTop: '5px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontFamily: 'inherit',
    fontSize: 'inherit',
  },
  button: {
    marginLeft: '10px',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 'inherit',
  },
  statusText: {
    marginTop: '5px',
    fontSize: '14px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '5px',
    padding: '5px',
  },
  deleteButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#ff5722',
    fontSize: '16px',
    marginLeft: '10px',
  },
};

export default ChatPage;