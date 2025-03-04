import { isDevelopMode, hamYab, hamYar, doostYab, hamType, } from '../api';
import { HelmetProvider,Helmet } from "react-helmet-async";
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAllMessages, getDefaultAvatarAddress, getUserProfilePhoto } from '../api';
import { Avatar, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Badge, Box, Card } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableRow = styled(TableRow)(({ theme, index }) => ({
    backgroundColor: index % 2 === 0 ? '#ffe6e6' : '#e6ffe6',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#d6d6d6',
    },
}));

const Messages = () => {
    const { userId } = useParams();
    const [profilePhotos, setProfilePhotos] = useState({});
    const [messages, setMessages] = useState([]);
    const [statusCode, setStatusCode] = useState(null);

    useEffect(() => {
        const fetchProfilePhotos = async () => {
            const newPhotos = {};
            for (const user of messages) {
                if (!profilePhotos[user.senderUserId]) {
                    const photoUrl = await getUserProfilePhoto(user.senderUserId);
                    newPhotos[user.senderUserId] = photoUrl;
                }
            }
            setProfilePhotos((prev) => ({ ...prev, ...newPhotos }));
        };
        if (messages.length > 0) {
            fetchProfilePhotos();
        }
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await getAllMessages();
            if (response?.isSuccess) {
                console.log(response);
                setStatusCode(response.statusCode);
                setMessages(response.model);
            } else {
                console.error('Error fetching messages');
            }
        };
        fetchMessages();
    }, []);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Card sx={{ maxWidth: 500, p: 3, borderRadius: "12px", boxShadow: 3 }}>

            <HelmetProvider>
              <Helmet>
                <title>{hamYab() } | { hamYar()}</title>
              </Helmet>
            </HelmetProvider>


                {statusCode === 6969 ? (
                    <div className="noMessages">
                        <h3>گفتگویی یافت نشد. برای شروع گفتگو،</h3>
                        <h1>یک پیام ارسال کنید.</h1>
                    </div>
                ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Table>
                            <TableBody>
                                {messages.map((message, index) => (
                                    <StyledTableRow
                                        key={message.senderUserId}
                                        index={index}
                                        component={Link}
                                        to={`/chat/${message.senderUserId}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Avatar
                                                    src={profilePhotos[message.senderUserId]}
                                                    alt={message.senderName}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        console.log('error avatar search', message.genderId);
                                                        e.target.src = getDefaultAvatarAddress(message.genderId);
                                                    }}
                                                    sx={{ width: 40, height: 40 }}
                                                />
                                                <Box ml={1} display="flex" flexDirection="column" justifyContent="center">
                                                    <span>{message.senderName}</span>
                                                    {message.unreadMessagesCount > 0 && (
                                                        <Badge
                                                            badgeContent={message.unreadMessagesCount}
                                                            color="success"
                                                            sx={{ mt: 0.5 }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">{message.lastReceivedMessageDate}</TableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Card>
        </Box>
    );
};

export default Messages;