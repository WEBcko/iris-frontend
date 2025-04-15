import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MUILink from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import { useForm, SubmitHandler } from "react-hook-form";
import { SignInInput } from "../../../types/auth";
import { useSignIn } from "../../../hooks/useAuth/useSignIn";
import { Link, useNavigate } from "@tanstack/react-router";
import { encryptToken } from "../../../utils/encryption";
import { useAuth } from "../../../context/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth as firebaseAuth } from "../../../firebase";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function LoginCard() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>();

  const { mutate: signIn } = useSignIn();
  const navigate = useNavigate();
  const auth = useAuth();
  const onSubmit: SubmitHandler<SignInInput> = async (data) => {
    await signInWithEmailAndPassword(firebaseAuth, data.email, data.password);
    signIn(data, {
      onSuccess: (res) => {
        const encrypted = encryptToken(res.access_token);
        auth.login(encrypted, res.user);
        navigate({ to: "/" });
      },
    });
  };

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: "flex", md: "none" } }}>Blog</Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Entrar
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            {...register("email", {
              required: "Please enter a valid email address.",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email address.",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password">Senha</FormLabel>
          <TextField
            id="password"
            type="password"
            placeholder="••••••"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long.",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </FormControl>

        <Button type="submit" fullWidth variant="contained">
          Entrar
        </Button>

        <Typography sx={{ textAlign: "center" }}>
          Não tem uma conta?{" "}
          <span>
            <MUILink
              component={Link}
              to="/register"
              color="inherit"
              sx={{
                textTransform: "capitalize",
                textDecoration: "none",
              }}
            >
              cadastre-se
            </MUILink>
          </span>
        </Typography>
      </Box>
    </Card>
  );
}
