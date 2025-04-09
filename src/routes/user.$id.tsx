import { Avatar, Box, Button, Grid, Typography, CircularProgress, Input } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useUserPosts } from "../hooks/usePosts/useGetUserPosts";
import { useUserById } from "../hooks/useUsers/useGetUserById";
import { useState, useEffect } from "react";
import { followUser } from "../service/user/user";
import { changeProfilePicture } from "../service/profile/profile";
import { useAuth } from "../context/auth"; 

export const Route = createFileRoute("/user/$id")({
  component: UserProfileComponent,
});

export default function UserProfileComponent() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: userData, isLoading: userLoading, error: userError, refetch } = useUserById(id);
  const { data: postsData, isLoading: postsLoading, error: postsError } = useUserPosts(id);
  const { user: currentUser } = useAuth(); 
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(userData?.user_image || "https://picsum.photos/100");
  const [hover, setHover] = useState(false);
  const posts = postsData ?? []; 
  const isCurrentUser = currentUser?.id.toString() === id; 

  useEffect(() => {
    if (userData) {
      setIsFollowing(userData.is_following);
      setProfileImage(userData.user_image || "https://picsum.photos/100");
    }
  }, [userData]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    if (uploadedFile) {
      const fileUrl = URL.createObjectURL(uploadedFile);
      setProfileImage(fileUrl); // Atualiza a visualização local

      try {
        await changeProfilePicture(uploadedFile); // Faz upload da imagem
        refetch(); // Atualiza os dados do usuário no backend
      } catch (error) {
        console.error("Erro ao atualizar a foto de perfil", error);
      }
    }
  };

  const handleFollow = async () => {
    try {
      if (id) {
        await followUser(id);
      }
      setIsFollowing(!isFollowing);
      refetch();
    } catch (error) {
      console.error("Erro ao seguir usuário", error);
    }
  };

  if (userLoading || postsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (userError || postsError) {
    return (
      <Typography textAlign="center" color="error" mt={4}>
        Erro ao carregar os dados do usuário. Tente novamente mais tarde.
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "800px", margin: "auto", padding: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
        
                {isCurrentUser ? (
          <Box position="relative" display="inline-block">
            <label
              htmlFor="profile-upload"
              style={{
                position: "relative",
                display: "inline-block",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <Avatar 
                src={profileImage} 
                sx={{ width: 100, height: 100, border: "2px solid white" }} 
              />

              {hover && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Efeito escurecido ao passar o mouse
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PhotoCameraIcon sx={{ color: "white", fontSize: 24 }} />
                </Box>
              )}
            </label>

            <Input
              id="profile-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
              inputProps={{ accept: "image/*" }}
            />
          </Box>
        ) : (
          <Avatar 
            src={profileImage} 
            sx={{ width: 100, height: 100, border: "2px solid white" }} 
          />
        )}

        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography variant="h6">{userData?.username || "Usuário"}</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
            <Typography><strong>{postsData?.length || 0}</strong> publicações</Typography>
            <Typography><strong>{userData?.followers_number || 0}</strong> seguidores</Typography>
            <Typography><strong>{userData?.following_number || 0}</strong> seguindo</Typography>
          </Box>
        </Box>
        {!isCurrentUser && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button 
              variant={isFollowing ? "outlined" : "contained"} 
              sx={{ textTransform: "none" }} 
              onClick={handleFollow}
            >
              {isFollowing ? "Seguindo" : "Seguir"}
            </Button>
            <Button variant="outlined" startIcon={<ChatIcon />}>Chat</Button>
          </Box>
        )}
      </Box>

      <Box sx={{ borderTop: "1px solid gray", mt: 3, pt: 2 }}>
        {posts?.length > 0 ? (
          <Grid container spacing={1}>
  {posts.map((post, index) => (
    <Grid item xs={4} sm={4} md={4} key={index}>
      <Box
        sx={{
          width: "100%",
          paddingTop: "100%",
          position: "relative",
          background: `url("https://picsum.photos/300") center/cover no-repeat`,
          cursor: "pointer",
          "&:hover": { opacity: 0.8 },
        }}
      />
    </Grid>
  ))}
</Grid>
        ) : (
          <Typography textAlign="center" width="100%" mt={2}>
            Nenhuma postagem encontrada.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
