import styled from 'styled-components';
import { useState } from 'react';
import GridCell from './GridCell';
import EXAMPLES from './EXAMPLES';
import {
  getStartState,
  setCellValueInGrid,
  getErrors,
  checkSolved,
} from './helpers';

function MainGrid({ selectedNumber, cellOptionsShown, errorsVisibility }) {
  const [gridState, setGridState] = useState(() =>
    getStartState(EXAMPLES.EASY.GRID_99)
  );

  function onClickHandler(cell) {
    return () => {
      if (cell.value === selectedNumber) return;
      const cells = setCellValueInGrid(cell, selectedNumber, gridState.cells);
      const errors = getErrors(cells);
      setGridState({
        ...gridState,
        cells,
        errors,
      });
    };
  }

  const showErrorFunctions = {
    Grid: () => gridState.errors.cells.size >= 1,
    Cells: (cell) => gridState.errors.cells.has(cell),
    Groups: (cell) =>
      gridState.errors.columns.has(cell.column) ||
      gridState.errors.rows.has(cell.row) ||
      gridState.errors.segments.has(cell.segment),
  };

  const showError = showErrorFunctions[errorsVisibility] || (() => false);
  const solved = checkSolved(gridState.cells, gridState.errors.cells);

  // This id is only used for the crosshair.
  // We don't want the crosshair to show when the grid is solved.
  const id = solved ? '' : 'mainGrid';

  return (
    <StyledContainer id={id}>
      {gridState.cells.map((cell, ix) => {
        return (
          <GridCell
            onClick={onClickHandler(cell)}
            cell={cell}
            key={ix}
            cellOptionsShown={cellOptionsShown}
            error={showError(cell)}
            solved={solved}
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
