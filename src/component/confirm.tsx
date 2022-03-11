import * as React from 'react';

import { DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

export default function SimpleDialogDemo({
  callback,
  buttonString,
}: {
  callback: React.MouseEventHandler<HTMLButtonElement>;
  buttonString: string;
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Typography variant="subtitle1" component="div">
        Really Want to do {buttonString} ?
      </Typography>
      <br />
      <Button variant="outlined" onClick={handleClickOpen}>
        {buttonString}
      </Button>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Set backup account</DialogTitle>
        <DialogActions>
          <Button onClick={callback}>{buttonString}?</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
