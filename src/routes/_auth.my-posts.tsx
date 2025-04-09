import { createFileRoute } from "@tanstack/react-router";
import { useListMyPosts } from "../hooks/usePosts/useListMyPosts";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Grid2,
  IconButton,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import noImage from "../assets/no-image.png";

export const Route = createFileRoute("/_auth/my-posts")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data = [], isLoading, isError } = useListMyPosts();
  const { data: myPosts } = useListMyPosts();
  const truncateText = (text = "", maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  if (!isLoading && data.length === 0) {
    return (
      <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>
        Não temos posts!
      </Typography>
    );
  }

  return (
    <Grid2
      container
      direction="column"
      alignItems="center"
      spacing={2}
      sx={{ padding: "20px", minHeight: "100vh", overflowY: "hidden" }}
    >
      {myPosts?.map((item, index) => (
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={6}
          key={index}
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
                  src={item?.profile_image || "https://picsum.photos/100"}
                  sx={{ bgcolor: red[500] }}
                  aria-label="user"
                >
                  {item?.author?.charAt(0).toUpperCase() || "U"}
                </Avatar>
              }
              title={truncateText(item?.author || "Usuário Desconhecido", 30)}
              subheader={truncateText(item.title || "", 50)}
            />
            <CardMedia
              component="img"
              image={item.image_url || noImage}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "500px",
                minHeight: "350px",
                objectFit: "contain",
              }}
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {truncateText(item?.author, 25)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flexGrow: 1,
                  }}
                >
                  {truncateText(
                    item.description || "Nenhuma descrição disponível.",
                    50
                  )}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid2>
  );
}
