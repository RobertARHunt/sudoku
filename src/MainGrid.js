import styled from 'styled-components';
import { useState } from 'react';
import GridCell from './GridCell';
import EXAMPLES from './EXAMPLES';

function getEmptyCell(checkered) {
  return {
    value: 0,
    options: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]),
    checkered,
  };
}

function generateEmptyGrid() {
  const cells = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const seg = Math.floor(col / 3) + 3 * Math.floor(row / 3);
      cells.push(getEmptyCell(seg % 2 === 0));
    }
  }

  return cells;
}

function generateFromExample(example) {
  if (!example) return undefined;

  const cells = generateEmptyGrid();

  example.split('').forEach((v, i) => (cells[i].value = Number(v)));

  return cells;
}

function getStartState(example) {
  return {
    cells: generateFromExample(example) || generateEmptyGrid(),
  };
}

function MainGrid() {
  const [gridState, setGridState] = useState(
    getStartState(EXAMPLES.EASY.GRID_1)
  );

  return (
    <StyledContainer>
      {gridState.cells.map((cell, ix) => {
        return <GridCell cell={cell} key={ix}></GridCell>;
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