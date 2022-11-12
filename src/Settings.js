import CellErrorsShownController from './CellErrorsShownController';
import CellOptionsShownController from './CellOptionsShownController';
import Stack from '@mui/material/Stack';

function Settings(props) {
  return (
    <Stack sx={{ m: 1, minWidth: 80, maxWidth: 250 }}>
      <CellOptionsShownController {...props} />
      <CellErrorsShownController {...props} />
    </Stack>
  );
}

export default Settings;
