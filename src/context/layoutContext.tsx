import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  SetStateAction,
} from "react";
import { useMediaQuery, useTheme } from "@mui/material";

type LayoutContextType = {
  collapsed: boolean;
  toggled: boolean;
  openMenus: Record<string, boolean>;
  handleToggleSidebar: () => void;
  toggleMenu: (label: string) => void;
  isMobile: boolean;
  setCollapsed: (collapsed: boolean) => void;
  setToggled: (toggled: boolean) => void;
  setOpenMenus: (value: SetStateAction<Record<string, boolean>>) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const handleToggleSidebar = () => {
    isMobile ? setToggled((prev) => !prev) : setCollapsed((prev) => !prev);
  };

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
    if (collapsed) setOpenMenus({});
  }, [collapsed]);

  useEffect(() => {
    if (isMobile) setCollapsed(false);
  }, [isMobile]);

  return (
    <LayoutContext.Provider
      value={{
        collapsed,
        toggled,
        openMenus,
        handleToggleSidebar,
        toggleMenu,
        isMobile,
        setCollapsed,
        setToggled,
        setOpenMenus,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
