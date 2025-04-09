// src/context/SnackbarContext.tsx
import * as React from "react";
import { Alert, AlertColor, Snackbar } from "@mui/material";

type ShowSnackbarType = (message: string, severity?: AlertColor) => void;

// Criamos uma referência global para a função
let showSnackbarRef: React.MutableRefObject<ShowSnackbarType | null>;

export const SnackbarContext = React.createContext<ShowSnackbarType | null>(
  null
);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState<AlertColor>("info");
  const showSnackbarRefInternal = React.useRef<ShowSnackbarType | null>(null);

  const showSnackbar = React.useCallback(
    (newMessage: string, newSeverity: AlertColor = "info") => {
      setMessage(newMessage);
      setSeverity(newSeverity);
      setOpen(true);
    },
    []
  );

  // Atualiza a referência global quando o componente monta
  React.useEffect(() => {
    showSnackbarRefInternal.current = showSnackbar;
    showSnackbarRef = showSnackbarRefInternal;
    return () => {
      showSnackbarRefInternal.current = null;
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export const showSnackbar = (message: string, severity?: AlertColor) => {
  if (showSnackbarRef?.current) {
    showSnackbarRef.current(message, severity);
  } else {
    console.warn("SnackbarProvider não está montado");
  }
};
