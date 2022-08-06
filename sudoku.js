const domMainGrid = document.getElementById('mainGrid');
var selectedNum = '';

document.addEventListener('keyup', function (key) {
  if (
    key.code === 'Digit1' ||
    key.code === 'Digit2' ||
    key.code === 'Digit3' ||
    key.code === 'Digit4' ||
    key.code === 'Digit5' ||
    key.code === 'Digit6' ||
    key.code === 'Digit7' ||
    key.code === 'Digit8' ||
    key.code === 'Digit9' ||
    key.code === 'KeyX' ||
    key.code === 'Digit0'
  ) {
    if (key.key == 'x' || key.key == '0') {
      selectedNum = '';
    } else {
      selectedNum = key.key;
    }
  }
});

const gridCells = Array(0);
const gridColumns = Array(9)
  .fill(0)
  .map(() => Array());
const gridRows = Array(9)
  .fill(0)
  .map(() => Array());
/**
 * @type {HTMLDivElement[][]}
 */
const gridSegments = Array(9)
  .fill(0)
  .map(() => Array());

function prepareGrid() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const seg = Math.floor(col / 3) + 3 * Math.floor(row / 3);
      const cellDiv = document.createElement('div');
      cellDiv.textContent = '';
      if (seg % 2) {
        cellDiv.classList.add('oddSeg');
      }
      cellDiv.col = gridColumns[col];
      cellDiv.row = gridRows[row];
      cellDiv.seg = gridSegments[seg];
      gridCells.push(cellDiv);
      gridColumns[col].push(cellDiv);
      gridRows[row].push(cellDiv);
      gridSegments[seg].push(cellDiv);
      cellDiv.onclick = () => cellClick(cellDiv);
      domMainGrid.appendChild(cellDiv);
    }
  }
}

prepareGrid();

function setCell(div, value) {
  div.innerHTML = value;

  checkCells(div.seg, 'segmentError');
  checkCells(div.row, 'rowError');
  checkCells(div.col, 'colError');
  if (checkCompletion()) {
    setTimeout(() => alert('You Win!'), 100);
  }
}

function cellClick(div) {
  setCell(div, selectedNum);
}

function checkCells(cells, errorClass) {
  const values = cells.map((div) => div.innerHTML);
  const valSet = new Set();
  for (let i = 0; i < 9; i++) {
    const val = values[i];
    if (val != '') {
      if (valSet.has(val)) {
        cells.forEach((cell) => {
          cell.classList.add(errorClass);
        });
        return;
      } else {
        valSet.add(val);
      }
    }
  }
  cells.forEach((cell) => {
    cell.classList.remove(errorClass);
  });
}

function checkCompletion() {
  if (gridColumns.every(checkCol)) {
    return true;
  } else {
    return false;
  }
}

function checkCol(col) {
  return col.every(checkCell);
}

function checkCell(cell) {
  if (cell.innerHTML == '' || cell.classList.contains('errorClass')) {
    return false;
  } else {
    return true;
  }
}

function handleNumClickEvent(eventArgs) {
  const button = eventArgs.target;
  const value = button.value;
  if (value == 'X') {
    selectedNum = '';
  } else {
    selectedNum = value;
  }

  [...document.getElementsByClassName('numButton')].forEach(
    (element, index, array) => {
      element.classList.remove('selected');
    }
  );
  button.classList.add('selected');
}

[...document.getElementsByClassName('numButton')].forEach(
  (element, index, array) => {
    element.onclick = handleNumClickEvent;
  }
);

function getOptions(celldiv) {
  const optionsSet = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  celldiv.col.forEach((c) => optionsSet.delete(c.innerHTML));
  celldiv.row.forEach((c) => optionsSet.delete(c.innerHTML));
  celldiv.seg.forEach((c) => optionsSet.delete(c.innerHTML));
  const options = Array.from(optionsSet);
  return options;
}

function firstComplexity() {
  gridCells.map((cell) => {
    if (cell.innerHTML == '') {
      if (getOptions(cell).length == 1) {
        cell.innerHTML = getOptions(cell)[0];
      }
    }
  });
}

function secondComplexity() {}

function autoFinish() {
  firstComplexity(); // fill in any cells with only one option
  // while (!checkCompletion()) {
  //   firstComplexity(); // fill in any cells with only one option
  //   secondComplexity(); // find any number (more than one) of cells in a row, column or segment with any number (more than one) of common possibilities, if the number of common possibilities is one less than the number of cells in the row, column or segment with that number of common possibilities, and there is one that has one other option, that one must be filled with the extra option it has.
  // }
}

function printGrid() {
  console.log(
    gridCells.map((c) => (c.innerHTML == '' ? ' ' : c.innerHTML)).join('')
  );
}

function loadGrid(input) {
  input.split('').forEach((v, i) => setCell(gridCells[i], v.trim()));
}

const EASY_GRID_1 = `6 32 81 7   3 6   8  5 1  3584   679         716   4324  9 3  1   7 5   2 76 45 8`;
const MOD_GRID_1 =
  '47    36 6  4 2  9     32 4 8  7 94    3 6    54 2  1 7 18     9  6 4  7 45    91';

loadGrid(MOD_GRID_1);
