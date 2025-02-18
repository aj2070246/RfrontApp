import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMessages, sendMessage, getUserInfo } from '../api';

const ChatPage = () => {
  const { userId } = useParams();
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

  useLayoutEffect(() => {
    // اطمینان از اینکه چت بعد از رندر شدن کامل اسکرول شود
    requestAnimationFrame(() => {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // تاخیر کوتاه برای اطمینان از اینکه پیام‌ها لود شده‌اند
    });
  }, [messages]);

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

  const handleMouseEnter = (messageStatusId) => {
    setShowStatusText(messageStatusId);
  };

  const handleMouseLeave = () => {
    setShowStatusText(null);
  };

  const handleClick = () => {
    setShowStatusText((prevState) => !prevState);
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
            onMouseEnter={() => handleMouseEnter(msg.messageStatusId)}
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

            {/* نمایش متن وضعیت پیام زمانی که موس روی آن می‌رود یا کلیک می‌شود */}
            {showStatusText === msg.messageStatusId && (
              <div style={styles.statusText}>
                {msg.messageStatus} {/* یا متن مربوط به messageStatusText */}
              </div>
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
  statusText: {
    fontSize: '14px',
    color: '#f1f1f1',
    marginTop: '5px',
    fontStyle: 'italic',
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
};

export default ChatPage;
