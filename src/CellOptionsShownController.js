import { Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

function CellOptionsShownController({ cellOptionsShown, setCellOptionsShown }) {
  const handleChange = (event) => {
    setCellOptionsShown(event.target.checked);
  };

  return (
    <FormControlLabel
      control={<Switch checked={cellOptionsShown} onChange={handleChange} />}
      label="Show Cell Options?"
    />
  );
}

export default CellOptionsShownController;
