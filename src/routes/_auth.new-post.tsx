import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  useTheme,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useCreatePost } from "../hooks/usePosts/useCreatePost";
import { CreatePostInput } from "../types/posts";
import { Image, CameraAlt } from "@mui/icons-material";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/_auth/new-post")({
  component: NewPostPage,
});

function NewPostPage() {
  const theme = useTheme();
  const { mutate: createPost, isPending: isLoading } = useCreatePost();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CreatePostInput>();

  const imageFile = watch("image");

  useEffect(() => {
    if (imageFile?.[0]) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(imageFile[0]);
    }
  }, [imageFile]);

  const onSubmit: SubmitHandler<CreatePostInput> = (data) => {
    createPost(data, {
      onSuccess: () => {
        reset();
        setPreviewImage(null);
        navigate({
          to: "/",
        });
      },
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card
        sx={{
          boxShadow: 3,
          borderRadius: 4,
          background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              textAlign: "center",
              color: theme.palette.primary.main,
              mb: 4,
            }}
          >
            Criar Novo Post
            <Typography variant="subtitle1" color="text.secondary">
              Compartilhe suas ideias com o mundo
            </Typography>
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="Título"
              variant="outlined"
              fullWidth
              {...register("title", { required: "Título é obrigatório" })}
              error={!!errors.title}
              helperText={errors.title?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Image color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              label="Descrição"
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              {...register("description")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <Box
              sx={{
                position: "relative",
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <input
                accept="image/*"
                type="file"
                hidden
                id="image-upload"
                {...register("image")}
              />
              <label htmlFor="image-upload">
                <Button
                  component="span"
                  startIcon={<CameraAlt />}
                  variant="outlined"
                  color="primary"
                >
                  Adicionar Imagem
                </Button>
              </label>
              {previewImage && (
                <Box
                  component={"img"}
                  src={previewImage}
                  sx={{
                    width: "100%",
                    height: 300,
                    mt: 2,
                    objectFit: "contain",
                  }}
                />
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: 16,
                fontWeight: 600,
                textTransform: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Publicar Post"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
