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
      cellDiv.options = [];
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

function setCell(cellDiv, value) {
  cellDiv.innerHTML = value;

  updateOptions(cellDiv);

  checkCells(cellDiv.seg, 'segmentError');
  checkCells(cellDiv.row, 'rowError');
  checkCells(cellDiv.col, 'colError');

  if (checkCompletion()) {
    setTimeout(() => alert('You Win!'), 100);
  }
}

function updateOptions(cellDiv) {
  const cellDivs = new Set(cellDiv.row.concat(cellDiv.col, cellDiv.seg));
  cellDivs.forEach((c) => (c.options = getOptions(c)));
}

function cellClick(cellDiv) {
  setCell(cellDiv, selectedNum);
}

function checkCells(cellDivs, errorClass) {
  const values = cellDivs.map((c) => c.innerHTML);
  const valSet = new Set();
  for (let i = 0; i < 9; i++) {
    const val = values[i];
    if (val != '') {
      if (valSet.has(val)) {
        cellDivs.forEach((c) => {
          c.classList.add(errorClass);
        });
        return;
      } else {
        valSet.add(val);
      }
    }
  }
  cellDivs.forEach((c) => {
    c.classList.remove(errorClass);
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

function checkCell(cellDiv) {
  if (cellDiv.innerHTML == '' || cellDiv.classList.contains('errorClass')) {
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
  if (celldiv.innerHTML != '') {
    return [];
  }
  const optionsSet = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  celldiv.col.forEach((c) => optionsSet.delete(c.innerHTML));
  celldiv.row.forEach((c) => optionsSet.delete(c.innerHTML));
  celldiv.seg.forEach((c) => optionsSet.delete(c.innerHTML));
  const options = Array.from(optionsSet);
  return options;
}

function solveByElimination() {
  var solvableCell;
  while ((solvableCell = gridCells.find((c) => c.options.length == 1))) {
    setCell(solvableCell, solvableCell.options[0]);
  }
}

function solveByGroupElimination() {
  gridCells
    .filter((cellDiv) => cellDiv.innerHTML == '')
    .forEach((cellDiv) => {
      // debugger;

      let optionsSet = groupElimination(cellDiv.col, cellDiv);
      if (optionsSet.size == 1) {
        setCell(cellDiv, Array.from(optionsSet)[0]);
      } else {
        optionsSet = groupElimination(cellDiv.row, cellDiv);
        if (optionsSet.size == 1) {
          setCell(cellDiv, Array.from(optionsSet)[0]);
        } else {
          optionsSet = groupElimination(cellDiv.seg, cellDiv);
          if (optionsSet.size == 1) {
            setCell(cellDiv, Array.from(optionsSet)[0]);
          }
        }
      }
    });
}

function groupElimination(group, cellDiv) {
  const optionsSet = new Set(cellDiv.options);
  group.forEach((c) => {
    if (c != cellDiv) {
      c.options.forEach((o) => optionsSet.delete(o));
    }
  });
  return optionsSet;
}

function autoFinish() {
  solveByElimination();
  solveByGroupElimination();
}

function printGrid() {
  console.log(
    gridCells.map((c) => (c.innerHTML == '' ? ' ' : c.innerHTML)).join('')
  );
}

function loadGrid(input) {
  input.split('').forEach((v, i) => setCell(gridCells[i], v.trim()));
}

const EXAMPLES = {
  EASY: {
    GRID_1:
      '6 32 81 7   3 6   8  5 1  3584   679         716   4324  9 3  1   7 5   2 76 45 8',
  },
  MODERATE: {
    GRID_1:
      '47    36 6  4 2  9     32 4 8  7 94    3 6    54 2  1 7 18     9  6 4  7 45    91',
  },
  HARD: {
    GRID_1:
      ' 2 6  4   137         3    9   8 6   5 4 2 9   7 9   8    1     4   825   9  6 7 ',
  },
};

loadGrid(EXAMPLES.MODERATE.GRID_1);
