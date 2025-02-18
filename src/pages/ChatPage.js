import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom'; // اضافه کردن این خط
import { getMessages, sendMessage, getUserInfo, deleteMessage } from '../api';

const ChatPage = () => {
  const { userId } = useParams();  // استفاده از useParams برای گرفتن userId از URL
  const senderUserId = 'u1';
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [showStatusText, setShowStatusText] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
      fetchMessages();
    }
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const response = await getMessages(senderUserId, userId);
      if (response.data.isSuccess) {
        setMessages(response.data.model.reverse());
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo(userId);
      if (response.data.isSuccess) {
        setUserInfo(response.data.model);
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
    <div style={styles.container}>
      {userInfo && (
        <div style={styles.userInfoContainer}>
          <div style={styles.userDetails}>
            <p style={styles.userName}>
              پیام شخصی با <br />
              {userInfo.firstName} {userInfo.lastName}
            </p>
            <p style={styles.userInfo}>
              - شهر {userInfo.province}
            </p>
            <p style={styles.userInfo}>
              {userInfo.marriageStatus} | {userInfo.liveType}
            </p>
          </div>
          <img 
            src={`https://i.pravatar.cc/40?img=${userId}`} 
            alt="Profile" 
            style={styles.profileImage} 
          />
        </div>
      )}

<div style={styles.chatBox}>
  {messages.map((msg, index) => (
    <div
      key={index}
      onMouseEnter={() => msg.senderUserId === senderUserId && handleMouseEnter(msg.messageStatusId)} // هاور فقط برای پیام‌های ارسالی
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        ...styles.message,
        backgroundColor: msg.senderUserId === senderUserId ? '#A97775' : '#2196F3',
        alignSelf: msg.senderUserId === senderUserId ? 'flex-end' : 'flex-start',
      }}
    >
      <p style={styles.text}>{msg.messageText}</p>
      <span style={styles.time}>{new Date(msg.sendDate).toLocaleDateString()}</span>

      {/* نمایش تیک‌ها فقط برای پیام‌های ارسالی */}
      {msg.senderUserId === senderUserId && (
        <span style={styles.text}>
          {msg.messageStatusId === 1 ? '✔️' :
           msg.messageStatusId === 2 ? '✔️✔️' : 
           msg.messageStatusId === 3 ? '✅' : ''}
        </span>
      )}

      {/* نمایش متن وضعیت پیام زمانی که موس روی آن می‌رود یا کلیک می‌شود (فقط برای پیام‌های ارسالی) */}
      {msg.senderUserId === senderUserId && showStatusText === msg.messageStatusId && (
        <div style={styles.statusText}>
          <span style={{ color: '#000' }}>{msg.messageStatus}</span> {/* متن وضعیت سیاه */}
        </div>
      )}

      {/* علامت سطل آشغال برای حذف پیام */}
      {msg.senderUserId === senderUserId && (
        <button 
          onClick={() => handleDeleteMessage(msg.id)} 
          style={styles.deleteButton}
        >
          🗑️
        </button>
      )}
    </div>
  ))}
  <div ref={messagesEndRef} /> {/* نقطه اسکرول به آخر چت */}
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
    height: '100vh',
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
    width: '40px',
    height: '40px',
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
  },
  button: {
    marginLeft: '10px',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
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
};

export default ChatPage;
