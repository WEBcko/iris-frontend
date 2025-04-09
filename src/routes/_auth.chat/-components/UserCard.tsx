import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";

interface User {
  id: number;
  username: string;
  user_image: string | null;
  followers_number: number;
}

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const baseUrl = import.meta.env.VITE_API_URL;

  return (
    <Link to={`/`}>
      <Card sx={{ maxWidth: 345, m: 1 }}>
        {user.user_image ? (
          <CardMedia
            component="img"
            height="140"
            image={`${user.user_image}`}
            alt={user.username}
          />
        ) : (
          <CardMedia
            component="div"
            sx={{
              height: 140,
              backgroundColor: "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No Image
            </Typography>
          </CardMedia>
        )}
        <CardContent>
          <Typography variant="h6" component="div">
            {user.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Seguidores: {user.followers_number}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default UserCard;
