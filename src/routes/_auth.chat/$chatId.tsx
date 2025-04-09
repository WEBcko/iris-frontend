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
import { useNavigate, createFileRoute, Link } from '@tanstack/react-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/auth';
import { auth, db } from '../../firebase';
import { useSearchUsersByName } from '../../hooks/useUsers/useSearchUsersByName';
import ChatRoom from './-components/ChatRoom';

export const Route = createFileRoute('/_auth/chat/$chatId')({
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
  const authContext = useAuth();

  const [search, setSearch] = useState('');
  const { data, isLoading } = useSearchUsersByName(search);
  const [firebaseUsers, setFirebaseUsers] = useState<FirebaseUser[]>([]);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  const { chatId } = Route.useParams();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

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
      if (!currentUser?.email || firebaseUsers.length === 0) return;

      const currentUserData = firebaseUsers.find(u => u.email === currentUser.email);
      if (!currentUserData) return;

      const chatsRef = collection(db, 'chats');
      const chatQuery = query(chatsRef, where('participants', 'array-contains', currentUserData.id));
      const chatSnapshot = await getDocs(chatQuery);

      const userChats = chatSnapshot.docs.map(docSnap => {
        const chat = docSnap.data() as ChatData;
        const otherUserId = chat.participants.find(id => id !== currentUserData.id);
        const otherUser = firebaseUsers.find(u => u.id === otherUserId);

        return { id: docSnap.id, participants: chat.participants, otherUser };
      });

      setChats(userChats);
      setChatsLoading(false);
    };

    fetchChats();
  }, [currentUser, firebaseUsers]);

  const handleNavigateToChat = (id: string) => {
    navigate({ to: '/chat/$chatId', params: { chatId: id } });
  };

  return (
    <Grid container spacing={2} sx={{ p: 2, bgcolor: '#121212', color: '#ffffff' }}>
      {/* Sidebar */}
      <Grid item xs={3} sx={{ height: '100vh', borderRight: `1px solid ${theme.palette.divider}`, overflowY: 'auto' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ p: 2, color: '#ffffff' }}>Seus Chats</Typography>
          <IconButton onClick={() => setModalOpen(true)} sx={{ color: '#ffffff' }}>
            <AddIcon />
          </IconButton>
        </Box>
        {chatsLoading ? (
          <CircularProgress sx={{ mx: 'auto', display: 'block', color: '#ffffff' }} />
        ) : (
          <List>
            {chats.map(chat => (
              <ListItem key={chat.id} component="li" onClick={() => handleNavigateToChat(chat.id)} sx={{ bgcolor: chat.id === chatId ? '#1976d2' : 'transparent' }}>
                <ListItemAvatar>
                  <Avatar src={chat.otherUser?.avatarUrl || 'https://via.placeholder.com/50'} />
                </ListItemAvatar>
                <ListItemText primary={chat.otherUser?.username || 'Usuário Desconhecido'} />
              </ListItem>
            ))}
          </List>
        )}
      </Grid>

      {/* Conteúdo principal com ChatRoom */}
      <Grid item xs={9}>
        <Button variant="contained" component={Link} to="/chat" sx={{ mb: 2 }}>
          Voltar
        </Button>
        {currentUser ? (
          <ChatRoom chatId={chatId} currentUserId={currentUser.uid} />
        ) : (
          <Typography>Usuário não autenticado</Typography>
        )}
      </Grid>

      {/* Modal para pesquisar usuários */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ bgcolor: '#1e1e1e', p: 3, borderRadius: 2, width: 400, margin: '10vh auto', color: '#ffffff' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Pesquisar usuários</Typography>
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
            <CircularProgress sx={{ color: '#ffffff', mt: 2 }} />
          ) : (
            <List>
              {data?.map(user => (
                <ListItem key={user.id} onClick={() => handleNavigateToChat(user.id.toString())}>
                  <ListItemAvatar>
                    <Avatar src={user.user_image || 'https://via.placeholder.com/50'} />
                  </ListItemAvatar>
                  <ListItemText primary={user.username} secondary={user.email} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Modal>
    </Grid>
  );
}