import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllMessages } from '../api';
import { Avatar, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import {    Card , Box} from "@mui/material";
const StyledTableRow = styled(TableRow)(({ theme, index }) => ({
    backgroundColor: index % 2 === 0 ? '#ffe6e6' : '#e6ffe6',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#d6d6d6',
    },
}));

const Messages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await getAllMessages();
            if (response?.isSuccess) {
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
                                            <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.senderUserId}`} />
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
            </Card>
        </Box>
    );
};

export default Messages;
