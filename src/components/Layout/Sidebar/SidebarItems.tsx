import { JSX } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ChatIcon from "@mui/icons-material/Chat";
import HomeIcon from "@mui/icons-material/Home";

export interface SidebarItem {
  label: string;
  icon?: JSX.Element;
  path?: string;
  children?: SidebarItem[];
  role?: string;
  isNew?: boolean;
  notificationCount?: number;
}

export const getSidebarItems = (userId?: number): SidebarItem[] => [
  {
    label: "Home",
    icon: <HomeIcon />,
    path: "/",
  },
  {
    label: "Meu Perfil",
    icon: <DashboardIcon />,
    path: userId ? `/user/${userId}` : undefined, 
  },
  {
    label: "Criar Post",
    icon: <SummarizeIcon />,
    path: "/new-post",
  },
  {
    label: "Favoritos",
    icon: <SummarizeIcon />,
    path: "/favorites",
  },
  {
    label: "Chat",
    icon: <ChatIcon />,
    path: "/chat",
  },
];
