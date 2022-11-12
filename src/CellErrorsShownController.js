import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { FormControl } from '@mui/material';

function CellErrorsShownController({ errorsVisibility, setErrorsVisibility }) {
  const handleChange = (event) => {
    setErrorsVisibility(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 80 }}>
      <InputLabel id="cell-errors-shown-controller">Errors</InputLabel>
      <Select
        labelId="cell-errors-shown-controller"
        value={errorsVisibility}
        label="Errors"
        onChange={handleChange}
        autoWidth
      >
        <MenuItem value={'None'}>None</MenuItem>
        <MenuItem value={'Grid'}>Grid</MenuItem>
        <MenuItem value={'Groups'}>Groups</MenuItem>
        <MenuItem value={'Cells'}>Cells</MenuItem>
      </Select>
    </FormControl>
  );
}

export default CellErrorsShownController;
