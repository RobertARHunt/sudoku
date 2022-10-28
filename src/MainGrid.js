import styled from 'styled-components';
import { useState } from 'react';
import GridCell from './GridCell';
import EXAMPLES from './EXAMPLES';

function getEmptyCell(props) {
  return {
    ...props,
    value: 0,
    options: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]),
  };
}

function generateEmptyGrid() {
  const cells = [];
  for (let row = 0; row < 9; row++) {
    for (let column = 0; column < 9; column++) {
      const segment = Math.floor(column / 3) + 3 * Math.floor(row / 3);
      const newCell = getEmptyCell({
        row,
        column,
        segment,
        checkered: segment % 2 === 0,
      });
      cells.push(newCell);
    }
  }

  return cells;
}

function generateFromExample(example) {
  const cells = generateEmptyGrid();
  example?.split('')?.forEach((v, i) => (cells[i].value = Number(v)));
  const cellsWithNewOptions = cells.map((original) =>
    setCellOptions(original, cells)
  );
  return cellsWithNewOptions;
}

function getStartState(example) {
  return {
    cells: generateFromExample(example),
  };
}

function setCellValue(cell, newValue) {
  return { ...cell, value: newValue };
}

function setCellValueInGrid(cell, newValue, cells) {
  const cellsWithNewValue = cells.map((original) =>
    cell === original ? setCellValue(original, newValue) : original
  );
  const siblingCells = getCellSiblings(cell, cells);
  const cellsWithNewOptions = cellsWithNewValue.map((original) =>
    siblingCells.includes(original)
      ? setCellOptions(original, cellsWithNewValue)
      : original
  );
  return cellsWithNewOptions;
}

function setCellOptions(cell, cells) {
  if (cell.value) {
    return { ...cell, options: new Set() };
  }
  const siblingCells = getCellSiblings(cell, cells);
  const options = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  siblingCells.forEach((c) => options.delete(c.value));
  return { ...cell, options };
}

function getCellSiblings(cell, cells) {
  return cells.filter(
    (c) =>
      c.row === cell.row ||
      c.column === cell.column ||
      c.segment === cell.segment
  );
}

function MainGrid({ selectedNumber }) {
  const [gridState, setGridState] = useState(
    getStartState(EXAMPLES.HARD.GRID_99)
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
