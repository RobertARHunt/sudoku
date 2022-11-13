import MainGrid from './MainGrid';
import NumberBar from './NumberBar';
import Settings from './Settings';
import { useState } from 'react';

function App() {
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [cellOptionsShown, setCellOptionsShown] = useState(false);
  const [errorsVisibility, setErrorsVisibility] = useState('None');

  return (
    <div className="App">
      <MainGrid
        selectedNumber={selectedNumber}
        cellOptionsShown={cellOptionsShown}
      />
      <NumberBar
        selectedValue={selectedNumber}
        setSelectedValue={setSelectedNumber}
      />
      <Settings
        cellOptionsShown={cellOptionsShown}
        setCellOptionsShown={setCellOptionsShown}
        errorsVisibility={errorsVisibility}
        setErrorsVisibility={setErrorsVisibility}
      />
    </div>
  );
}

export default App;
