import styled from 'styled-components';
import { useState } from 'react';
import GridCell from './GridCell';
import EXAMPLES from './EXAMPLES';
import { getStartState, setCellValueInGrid } from './helpers';

function MainGrid({ selectedNumber, cellOptionsShown }) {
  const [gridState, setGridState] = useState(() =>
    getStartState(EXAMPLES.EASY.GRID_1)
  );

  function newOnClickHandler(cell) {
    return () => {
      setGridState({
        ...gridState,
        cells: setCellValueInGrid(cell, selectedNumber, gridState.cells),
      });
    };
  }

  return (
    <StyledContainer>
      {gridState.cells.map((cell, ix) => {
        return (
          <GridCell
            onClick={newOnClickHandler(cell)}
            cell={cell}
            key={ix}
            cellOptionsShown={cellOptionsShown}
            error={false}
          ></GridCell>
        );
      })}
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  border: 1px solid rgb(199, 45, 45);
  background-color: white;
  height: 501px;
  width: 501px;
  display: grid;
  grid-template-columns: repeat(9, 11.111111111%);
  grid-template-rows: repeat(9, 11.111111111%);
  // position: fixed;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%);
`;

export default MainGrid;
