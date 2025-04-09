import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Grid2,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  TextField,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Ícone de fechar modal
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import { useState } from "react";
import { useListAllPosts } from "../hooks/usePosts/useListAllPosts";
import { Post } from "../types/posts";
import { useCreateComment } from "../hooks/usePosts/useCreateComment";
import noImage from "../assets/no-image.png";
import { useFavoritePost } from "../hooks/usePosts/useFavoritePost";
import { useLikeComent } from "../hooks/usePosts/useLikeComent";
import { useListComments } from "../hooks/usePosts/useListComments";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const navigate = useNavigate();

  const { data = [], isLoading, isError } = useListAllPosts();
  const [newComment, setNewComment] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);
  const createCommentMutation = useCreateComment();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const currentUsername = user?.user?.username || "Anônimo";
  const favoritePostMutation = useFavoritePost();

  const {
    data: comments = [],
    isLoading: isLoadingComments,
    refetch,
  } = useListComments(selectedPost?.id || null);

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost) return;

    createCommentMutation.mutate(
      { postId: selectedPost.id, content: newComment },
      {
        onSuccess: () => {
          setNewComment("");
          refetch();
        },
        onError: (error) => {
          console.error("Erro ao enviar comentário:", error);
        },
      }
    );
  };

  const handleFavoriteClick = (postId: number) => {
    favoritePostMutation.mutate(
      { postId },
      {
        onError: () => {
          console.error("Erro ao favoritar post");
        },
      }
    );
  };

  const handleOpenComments = (post: Post) => {
    setSelectedPost(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPost(null);
  };

  const likeCommentMutation = useLikeComent();

  const handleLikeComment = (commentId: number) => {
    likeCommentMutation.mutate(
      { commentId },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  const truncateText = (text = "", maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  if (isLoading) return <Typography>Carregando...</Typography>;
  if (isError) return <Typography>Erro ao carregar os posts.</Typography>;

  return (
    <>
      <Grid
        container
        display={"flex"}
        direction="column"
        alignItems="center"
        spacing={2}
        sx={{ padding: "20px", minHeight: "100vh" }}
      >
        {data.map((item) => (
          <Grid
            item
            xs={12}
            sm={10}
            md={8}
            lg={6}
            key={item.id}
            sx={{ width: "100%" }}
          >
            <Card
              sx={{
                width: "100%",
                maxWidth: "600px",
                borderRadius: "12px",
                boxShadow: 3,
                margin: "0 auto",
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    src={item?.author_image || "https://picsum.photos/100"}
                    sx={{ bgcolor: red[500], cursor: "pointer" }}
                    onClick={() => navigate({ to: `/user/${item.user_id}` })}
                  >
                    {item?.author?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                }
                title={
                  <Typography
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate({ to: `/user/${item.user_id}` })}
                  >
                    {truncateText(item?.author || "Usuário Desconhecido", 30)}
                  </Typography>
                }
                subheader={truncateText(item.title || "", 50)}
              />

              <CardMedia
                component="img"
                image={"https://picsum.photos/1000"}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "500px",
                  minHeight: "350px",
                  objectFit: "contain",
                }}
              />
              <CardContent>
                <Typography
                  variant="body2"
                  sx={{ color: "gray", cursor: "pointer", mt: 1 }}
                  onClick={() => handleOpenComments(item)}
                >
                  {item.comments_number
                    ? `Ver todos os ${item.comments_number} comentários`
                    : "Sem comentários ainda"}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <IconButton onClick={() => handleFavoriteClick(item.id)}>
                  {item.favorited_by_user ? (
                    <FavoriteIcon sx={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <Typography variant="body2">{item.favorite_number}</Typography>

                <IconButton onClick={() => handleOpenComments(item)}>
                  <CommentIcon />
                </IconButton>
                <Typography variant="body2">{item.comments_number}</Typography>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        {selectedPost && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              height: "auto",
              padding: 2,
              position: "relative",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", top: 10, right: 10 }}
            >
              <CloseIcon />
            </IconButton>

            <Box
              sx={{
                flex: { xs: "none", md: "3 3 auto" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
              }}
            >
              <img
                src={selectedPost?.image_url || noImage}
                style={{
                  width: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>

            <Box
              sx={{
                width: "2px",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                display: { xs: "none", md: "block" },
              }}
            />
            <Box
              sx={{
                flex: { xs: "none", md: "2 2 auto" },
                display: "flex",
                flexDirection: "column",
                padding: 2,
                pb: 0,
              }}
            >
              <DialogTitle>Comentários</DialogTitle>
              <DialogContent
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  paddingBottom: "80px",
                }}
              >
                {isLoadingComments ? (
                  <CircularProgress />
                ) : comments.length > 0 ? (
                  <List>
                    {comments.map((comment) => (
                      <ListItem key={comment.id}>
                        <ListItemAvatar>
                          <Avatar
                            src={
                              comment.user_image || "https://picsum.photos/100"
                            }
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            comment.username === currentUsername
                              ? "Você"
                              : comment.username || "Anônimo"
                          }
                          secondary={comment.content}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ textAlign: "center", mt: 2, flexGrow: 1 }}
                  >
                    Sem comentários ainda.
                  </Typography>
                )}
              </DialogContent>

              <Box
                sx={{
                  position: "relative",

                  width: "100%",
                  backgroundColor: "white",
                  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <TextField
                  size="small"
                  fullWidth
                  variant="outlined"
                  placeholder="Escreva um comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button variant="contained" onClick={handleAddComment}>
                  Comentar
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </>
  );
}
