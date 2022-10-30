function onlyUnique() {}

function removeOptionsFromCells() {}

function removeOptionsFromGroup() {}

function optionsExcept() {}

function mergedCellOptions() {}

function getCellValue() {}

function deleteCellOption() {}

function setCellOptions(cell, cells) {
  if (cell.value) {
    return { ...cell, options: new Set() };
  }
  const siblingCells = getCellSiblings(cell, cells);
  const options = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  siblingCells.forEach((c) => options.delete(c.value));
  return { ...cell, options };
}

function setCellValue(cell, newValue) {
  return { ...cell, value: newValue };
}

function getCellSiblings(cell, cells) {
  return cells.filter(
    (c) =>
      c.row === cell.row ||
      c.column === cell.column ||
      c.segment === cell.segment
  );
}

export function setCellValueInGrid(cell, newValue, cells) {
  const cellsWithNewValue = cells.map((original) =>
    cell === original ? setCellValue(original, newValue) : original
  );
  const siblingCells = getCellSiblings(cell, cellsWithNewValue);
  const cellsWithNewOptions = cellsWithNewValue.map((original) =>
    siblingCells.includes(original)
      ? setCellOptions(original, cellsWithNewValue)
      : original
  );
  return cellsWithNewOptions;
}

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

export function getStartState(example) {
  console.log('getStartState');
  return {
    cells: generateFromExample(example),
  };
}

function getCombinations(array, size) {
  if (array.length < size) return [];

  const result = [];

  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (size === 1) {
      result.push([element]);
    } else {
      const remaining = array.slice(index + 1);
      const next = getCombinations(remaining, size - 1);
      next.forEach((n) => result.push([element, ...n]));
    }
  }

  return result;
}
