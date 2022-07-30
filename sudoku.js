const domMainGrid = document.getElementById('mainGrid');
var selectedNum = '';

document.addEventListener('keyup', function (key) {
  console.log(key.code);
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

var gridCells = Array(0);
var gridColumns = Array(9)
  .fill(0)
  .map(() => Array());
var gridRows = Array(9)
  .fill(0)
  .map(() => Array());
/**
 * @type {HTMLDivElement[][]}
 */
var gridSegments = Array(9)
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
      cellDiv.onclick = () => cellClick(cellDiv, col, row, seg);
      domMainGrid.appendChild(cellDiv);
    }
  }
}

prepareGrid();

function cellClick(div, col, row, seg) {
  const cell = col + row * 9;
  div.innerHTML = selectedNum;
  checkCells(gridSegments[seg], 'segmentError');
  checkCells(gridRows[row], 'rowError');
  checkCells(gridColumns[col], 'colError');
  if (checkCompletion()) {
    alert('You Win!');
  }
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

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////
////////
////////
////////
////////////////////////
////////////////////////
////////////////////////
////////////////////////
////////
////////
////////
////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

//cus why not

function getOptions(cellIndex) {
  var options = [];
  cell = gridCells[cellIndex];
  colNums = Array(9).map((i) => {
    cell.col[i.index].innerHTML;
  });

  rowNums = Array(9).map((i) => {
    cell.row[i.index].innerHTML;
  });

  segNums = Array(9).map((i) => {
    cell.seg[i.index].innerHTML;
  });

  if (cell.innerHTML === '') {
    for (let option = 1; option <= 9; option++) {
      optStr = option.toString();
      if (
        colNums.includes(option) ||
        rowNums.includes(option) ||
        segNums.includes(option)
      ) {
      } else {
        options.push(option);
      }
    }
  }
  return options;
}

function firstComplexity() {}

function secondComplexity() {}

function autoFinish() {
  while (!checkCompletion()) {
    firstComplexity(); // fill in any cells with only one option
    secondComplexity(); // find any number (more than one) of cells in a row, column or segment with any number (more than one) of common possibilities, if the number of common possibilities is one less than the number of cells in the row, column or segment with that number of common possibilities, and there is one that has one other option, that one must be filled with the extra option it has.
  }
}
