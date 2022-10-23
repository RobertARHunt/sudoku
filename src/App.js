import MainGrid from './MainGrid';
import NumberBar from './NumberBar';
import { useState } from 'react';

function App() {
  const [selectedNumber, setSelectedNumber] = useState();

  return (
    <div className="App">
      <MainGrid selectedNumber={selectedNumber}></MainGrid>
      <NumberBar
        selectedValue={selectedNumber}
        setSelectedValue={setSelectedNumber}
      />
    </div>
  );
}

export default App;
