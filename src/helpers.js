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
  const cells = generateFromExample(example);
  return {
    cells,
    errors: getErrors(cells),
  };
}

export function getErrors(cells) {
  const errors = {
    cells: new Set(),
    rows: new Set(),
    columns: new Set(),
    segments: new Set(),
  };

  cells.forEach((cell) => {
    if (cell.value === 0) return;
    if (
      cellsInRow(cells, cell.row).some(
        (c) => c !== cell && c.value === cell.value
      )
    ) {
      errors.cells.add(cell);
      errors.rows.add(cell.row);
    }
    if (
      cellsInColumn(cells, cell.column).some(
        (c) => c !== cell && c.value === cell.value
      )
    ) {
      errors.cells.add(cell);
      errors.columns.add(cell.column);
    }
    if (
      cellsInSegment(cells, cell.segment).some(
        (c) => c !== cell && c.value === cell.value
      )
    ) {
      errors.cells.add(cell);
      errors.segments.add(cell.segment);
    }
  });

  return errors;
}

function cellsInRow(cells, row) {
  return [
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [9, 10, 11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, 32, 33, 34, 35],
    [36, 37, 38, 39, 40, 41, 42, 43, 44],
    [45, 46, 47, 48, 49, 50, 51, 52, 53],
    [54, 55, 56, 57, 58, 59, 60, 61, 62],
    [63, 64, 65, 66, 67, 68, 69, 70, 71],
    [72, 73, 74, 75, 76, 77, 78, 79, 80],
  ][row].map((ix) => cells[ix]);
}

function cellsInColumn(cells, column) {
  return [
    [0, 9, 18, 27, 36, 45, 54, 63, 72],
    [1, 10, 19, 28, 37, 46, 55, 64, 73],
    [2, 11, 20, 29, 38, 47, 56, 65, 74],
    [3, 12, 21, 30, 39, 36, 55, 66, 75],
    [4, 13, 22, 31, 40, 49, 58, 67, 76],
    [5, 14, 23, 32, 41, 50, 59, 68, 77],
    [6, 15, 24, 33, 42, 51, 60, 69, 78],
    [7, 16, 25, 34, 43, 52, 61, 70, 79],
    [8, 17, 26, 35, 44, 53, 62, 71, 80],
  ][column].map((ix) => cells[ix]);
}

function cellsInSegment(cells, segment) {
  return [
    [0, 1, 2, 9, 10, 11, 18, 19, 20],
    [3, 4, 5, 12, 13, 14, 21, 22, 23],
    [6, 7, 8, 15, 16, 17, 24, 25, 26],
    [27, 28, 29, 36, 37, 38, 45, 46, 47],
    [30, 31, 32, 39, 40, 41, 48, 49, 50],
    [33, 34, 35, 42, 43, 44, 51, 52, 53],
    [54, 55, 56, 63, 64, 65, 72, 73, 74],
    [57, 58, 59, 66, 67, 68, 75, 76, 77],
    [60, 61, 62, 69, 70, 71, 78, 79, 80],
  ][segment].map((ix) => cells[ix]);
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
