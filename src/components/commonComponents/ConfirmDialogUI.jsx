import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

const ConfirmDialogUI = ({ open, message, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}         
      aria-labelledby="confirm-dialog"

    >
      <DialogTitle id="confirm-dialog" color='warning'>Are you sure ?</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color='error' variant='contained'>No</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
    

  );
};

export default ConfirmDialogUI;
