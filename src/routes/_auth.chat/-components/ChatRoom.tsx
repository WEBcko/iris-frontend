import React, { useEffect, useRef } from 'react';
import { useChatMessages } from '../../../hooks/useChat/useChatMessages';
import SendMessageForm from './SendMessageForm';
import {
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';

interface ChatRoomProps {
  chatId: string;
  currentUserId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId, currentUserId }) => {
  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useChatMessages(chatId);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  return (
    <Box
      sx={{
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#121212',
        color: '#ffffff',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          borderRadius: '16px',
          m: 2,
          mb: 0,
          p: 2,
          bgcolor: '#1e1e1e',
        }}
      >
        <List sx={{ p: 0 }}>
          {messages.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                Nenhuma mensagem ainda. Envie a primeira!
              </Typography>
            </Box>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.senderId === currentUserId;
              return (
                <ListItem
                  key={msg.id}
                  sx={{
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    px: 1,
                    my: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: 1,
                      maxWidth: '70%',
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: '40px' }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: isCurrentUser ? theme.palette.primary.main : theme.palette.secondary.main,
                        }}
                      >
                        {msg.senderUserName.slice(0, 2).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: isCurrentUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                        bgcolor: isCurrentUser ? theme.palette.primary.main : '#2a2a2a',
                        color: isCurrentUser ? '#ffffff' : '#dddddd',
                      }}
                    >
                      <ListItemText
                        primary={msg.text}
                        secondary={
                          <Typography
                            variant="caption"
                            color={isCurrentUser ? '#a0c8ff' : 'text.secondary'}
                            sx={{ display: 'block', mt: 0.5 }}
                          ></Typography>
                        }
                        sx={{ m: 0 }}
                        primaryTypographyProps={{ sx: { wordBreak: 'break-word' } }}
                      />
                    </Paper>
                  </Box>
                </ListItem>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <SendMessageForm chatId={chatId} currentUserId={currentUserId} />
    </Box>
  );
};

export default ChatRoom;
