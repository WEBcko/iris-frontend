import React, { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  useTheme,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Modal,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, createFileRoute } from '@tanstack/react-router';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../../context/auth';
import { db } from '../../firebase';
import { useSearchUsersByName } from '../../hooks/useUsers/useSearchUsersByName';

export const Route = createFileRoute('/_auth/chat/')({
  component: RouteComponent,
});

type FirebaseUser = {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
};

type ChatData = {
  id: string;
  participants: string[];
  otherUser?: FirebaseUser;
};

function RouteComponent() {
  const theme = useTheme();
  const navigate = useNavigate();
  const auth = useAuth();

  const [search, setSearch] = useState('');
  const { data, isLoading } = useSearchUsersByName(search);
  const [firebaseUsers, setFirebaseUsers] = useState<FirebaseUser[]>([]);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseUser));
      setFirebaseUsers(usersList);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      if (!auth.user?.email || firebaseUsers.length === 0) return;

      const currentUser = firebaseUsers.find(u => u.email === auth.user?.email);
      if (!currentUser) return;

      const chatsRef = collection(db, 'chats');
      const chatQuery = query(chatsRef, where('participants', 'array-contains', currentUser.id));
      const chatSnapshot = await getDocs(chatQuery);

      const userChats = chatSnapshot.docs.map(docSnap => {
        const chat = docSnap.data() as ChatData;
        const otherUserId = chat.participants.find(id => id !== currentUser.id);
        const otherUser = firebaseUsers.find(u => u.id === otherUserId);

        return { id: docSnap.id, participants: chat.participants, otherUser };
      });

      setChats(userChats);
      setChatsLoading(false);
    };

    fetchChats();
  }, [auth.user?.email, firebaseUsers]);

  const handleNavigateToChat = (chatId: string) => {
    navigate({ to: '/chat/$chatId', params: { chatId } });
  };

  const handleCreateChat = async (userId: string) => {
    if (!auth.user?.email) return;

    const currentUser = firebaseUsers.find(u => u.email === auth.user.email);
    if (!currentUser) return;

    const chatsRef = collection(db, 'chats');
    const chatQuery = query(
      chatsRef,
      where('participants', 'array-contains', currentUser.id)
    );
    const chatSnapshot = await getDocs(chatQuery);

    const existingChat = chatSnapshot.docs.find(docSnap => {
      const chatData = docSnap.data() as ChatData;
      return chatData.participants.includes(userId);
    });

    if (existingChat) {
      navigate({ to: '/chat/$chatId', params: { chatId: existingChat.id } });
      return;
    }

    const newChatRef = await addDoc(chatsRef, {
      participants: [currentUser.id, userId],
      createdAt: new Date(),
    });

    setChats(prevChats => [
      ...prevChats,
      { id: newChatRef.id, participants: [currentUser.id, userId], otherUser: firebaseUsers.find(u => u.id === userId) }
    ]);

    setModalOpen(false);
    navigate({ to: '/chat/$chatId', params: { chatId: newChatRef.id } });
  };

  return (
    <Grid container spacing={2} sx={{ p: 2, bgcolor: '#121212', color: '#ffffff' }}>
      <Grid item xs={3} sx={{ height: '100vh', borderRight: `1px solid ${theme.palette.divider}`, overflowY: 'auto' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ p: 2, color: '#ffffff' }}>Seus Chats</Typography>
          <IconButton onClick={() => setModalOpen(true)} sx={{ color: '#ffffff' }}>
            <AddIcon />
          </IconButton>
        </Box>
        {chatsLoading ? (
          <CircularProgress sx={{ mx: 'auto', display: 'block', color: '#ffffff' }} />
        ) : chats.length > 0 ? (
          <List>
            {chats.map((chat, index) => (
              <Box key={chat.id}>
                <ListItem button onClick={() => handleNavigateToChat(chat.id)}>
                  <ListItemAvatar>
                    <Avatar src={chat.otherUser?.avatarUrl || 'https://via.placeholder.com/50'} />
                  </ListItemAvatar>
                  <ListItemText primary={chat.otherUser?.username || 'Usuário Desconhecido'} />
                </ListItem>
                {index !== chats.length - 1 && <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />}
              </Box>
            ))}
          </List>
        ) : (
          <Typography sx={{ p: 2, color: '#ffffff' }}>Nenhum chat encontrado.</Typography>
        )}
      </Grid>

      <Grid item xs={9}>
        <Typography variant="h4" sx={{ color: '#ffffff' }}>Chat</Typography>
      </Grid>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ bgcolor: '#1e1e1e', p: 3, borderRadius: 2, width: 400, margin: '10vh auto', color: '#ffffff' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#ffffff' }}>Pesquisar Usuários</Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Pesquisar usuário"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{ endAdornment: <SearchIcon sx={{ color: '#ffffff' }} /> }}
            sx={{ input: { color: '#ffffff' }, fieldset: { borderColor: '#ffffff' } }}
          />
          {isLoading ? (
            <CircularProgress sx={{ color: '#ffffff' }} />
          ) : data && data.length ? (
            <List>
              {data.map(user => {
                const firebaseUser = firebaseUsers.find(u => u.username === user.username);
                if (!firebaseUser) return null;

                return (
                  <ListItem key={firebaseUser.id} button onClick={() => handleCreateChat(firebaseUser.id)}>
                    <ListItemAvatar>
                      <Avatar src={firebaseUser.avatarUrl || 'https://via.placeholder.com/50'} />
                    </ListItemAvatar>
                    <ListItemText primary={firebaseUser.username} secondary={firebaseUser.email} />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography sx={{ mt: 2 }}>Nenhum usuário encontrado.</Typography>
          )}
        </Box>
      </Modal>
    </Grid>
  );
}

export default RouteComponent;
