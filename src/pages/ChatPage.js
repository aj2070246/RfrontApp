import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // اضافه کردن این خط
import { getDefaultAvatarAddress, getMessages, sendMessage, getUserInfo, deleteMessage, getUserProfilePhoto } from '../api';
import { Card, Box } from "@mui/material";

const ChatPage = () => {
  const { userId } = useParams();  // استفاده از useParams برای گرفتن userId از URL
  const senderUserId = localStorage.getItem('userId');
  console.log('userId', userId);
  const [messages, setMessages] = useState([]);
  const [statusCode, setStatusCode] = useState(null);

  const defaultAvatar = getDefaultAvatarAddress();

  const [newMessage, setNewMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [showStatusText, setShowStatusText] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (userId && senderUserId) {  // بررسی می‌کنیم که مقادیر آماده باشند
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
      const response = await getMessages(senderUserId, userId);

      if (response.data.isSuccess) {
        setStatusCode(response.data.statusCode);

        setMessages(response.data.model.reverse());
      }
    } catch (error) {
    }
  };
  const fetchUserInfo = async () => {
    try {
      const currentUserId = localStorage.getItem('userId'); // مقدار مستقیم از localStorage

      const response = await getUserInfo(userId, currentUserId);
      if (response.isSuccess) { // بررسی مستقیم isSuccess
        setUserInfo(response.model); // دسترسی به model
      } else {
        console.error('API response indicates failure:', response);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };


  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await sendMessage(senderUserId, userId, newMessage);
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleMouseEnter = (statusId) => {
    setShowStatusText(statusId);
  };

  const handleMouseLeave = () => {
    setShowStatusText(null);
  };

  const handleClick = () => {
    // می‌توانید هر عملکرد دلخواهی برای کلیک پیام‌ها قرار دهید
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await deleteMessage(messageId);
      if (response.data.isSuccess) {
        // بعد از حذف پیام، لیست پیام‌ها را به‌روزرسانی کنید
        setMessages(messages.filter(msg => msg.id !== messageId));
        fetchMessages();

      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ maxWidth: 500, p: 3, borderRadius: "12px", boxShadow: 3 }}>
        <div style={styles.container}>
          {userInfo && (
            <Link to={`/profile/${userInfo.id}`} style={{ textDecoration: 'none' }} target='_blank'>
              <div style={styles.userInfoContainer}>
                <div style={styles.userDetails}>
                  <p style={styles.userName}>
                    پیام شخصی با <br />
                    {userInfo.firstName} {userInfo.lastName}
                  </p>
                  <p style={styles.userInfo}>
                    شهر {" "}{userInfo.province}
                  </p>
                  <p style={styles.userInfo}>
                    آخرین فعالیت {" "}{userInfo.lastActivityDate}
                  </p>
                  <p style={styles.userInfo}>
                    رابطه مورد نظر {" "}{userInfo.relationType}
                  </p>
                  <p style={styles.userInfo}>
                    {userInfo.marriageStatus} | {userInfo.liveType}
                  </p>
                </div>
                <img
                  src={getUserProfilePhoto(userId)}
                  alt="Profile"
                  style={styles.profileImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                  }}
                />
              </div>
            </Link>
          )}

          <div className="noMessages" style={styles.messagesContainer}>
            {statusCode == 6969 ? (
              <div className="noMessages">
                <h3>گفتگویی یافت نشد. برای شروع گفتگو،.</h3>
                <h1>یک پیام ارسال کنید.</h1>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  onMouseEnter={() => msg.senderUserId === senderUserId && handleMouseEnter(msg.messageStatusId)}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleClick}
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

                  <span style={styles.time}>
                    {new Date(msg.sendDate).toLocaleString('fa-IR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {msg.senderUserId === senderUserId && (
                    <span style={styles.text}>
                      {msg.messageStatusId === 1 ? '✔️' :
                        msg.messageStatusId === 2 ? '✔️✔️' : ''}
                    </span>
                  )}
                  {msg.senderUserId === senderUserId && showStatusText === msg.messageStatusId && (
                    <div style={styles.statusText}>
                      <span style={{ color: '#000' }}>
                        <span style={styles.text}>
                          {msg.messageStatusId === 1 ? 'ارسال شده' :
                            msg.messageStatusId === 2 ? 'خوانده شده' : ''}
                        </span>
                      </span>
                    </div>
                  )}
                  {msg.senderUserId === senderUserId && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      style={styles.deleteButton}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} style={{ height: '0' }} />
          </div>

          <div style={styles.inputContainer}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              style={styles.input}
            />
            <button onClick={handleSendMessage} style={styles.button}>ارسال</button>
          </div>
        </div>
      </Card>
    </Box>
  );

};

const styles = {


  statusText: {
    marginTop: '5px',
    fontSize: '14px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // می‌توانید برای پس‌زمینه از رنگ نیمه شفاف استفاده کنید
    borderRadius: '5px',
    padding: '5px',
  },

  deleteButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#ff5722', // رنگ سطل آشغال
    fontSize: '16px',
    marginLeft: '10px',
  },

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
  chatBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    overflowY: 'auto', // این خط برای قابلیت اسکرول به پایین است

  },
  message: {
    maxWidth: '60%',
    padding: '10px',
    borderRadius: '10px',
    color: '#fff',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',

    // backgroundColor: msg.senderUserId === senderUserId ? '#A97775' : '#2196F3',
    // width: '75%', // سه‌چهارم عرض
    // marginLeft: msg.senderUserId === senderUserId ? '25%' : '0', // پیام ارسالی: یک‌چهارم از چپ خالی
    // marginRight: msg.senderUserId === senderUserId ? '0' : '25%', // پیام دریافتی: یک‌چهارم از راست خالی
    // alignSelf: msg.senderUserId === senderUserId ? 'flex-end' : 'flex-start'
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
    fontFamily: 'inherit', // این خط را اضافه کنید
    fontSize: 'inherit', // این خط را اضافه کنید
  },
  button: {
    marginLeft: '10px',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit', // این خط را اضافه کنید
    fontSize: 'inherit', // این خط را اضافه کنید
  },
  statusText: {
    fontSize: '12px',
    color: '#888',
    marginTop: '5px',
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#f44336',
    fontSize: '18px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  messagesContainer: { // تغییر نام و اضافه کردن استایل
    flexGrow: 1, // بخش پیام‌ها فضای باقی‌مونده رو پر کنه
    maxHeight: '400px', // یه ارتفاع مشخص (قابل تنظیم)
    overflowY: 'auto', // اسکرول عمودی فعال بشه
    padding: '10px 0', // یه کم فاصله داخلی
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
};

export default ChatPage;
