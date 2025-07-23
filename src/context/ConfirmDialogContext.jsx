import { createContext, useContext, useState, useCallback } from "react";
import ConfirmDialogUI from "../components/commonComponents/ConfirmDialogUI";
const ConfirmDialogContext = createContext();

export const ConfirmDialogProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    open: false,
    message: '',
    resolve: null,
  });

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setDialogState({ open: true, message, resolve });
    });
  }, []);

  const handleClose = () => {
    setDialogState({ ...dialogState, open: false });
  };

  const handleConfirm = () => {
    dialogState.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    dialogState.resolve(false);
    handleClose();
  };

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}

      <ConfirmDialogUI
        open={dialogState.open}
        message={dialogState.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = () => {
  return useContext(ConfirmDialogContext);
};
