import { Fab } from "@mui/material";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import AddIcon from "@mui/icons-material/Add";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
