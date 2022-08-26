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
      cellDiv.options = new Set();
      cellDiv.rowNum = row;
      cellDiv.colNum = col;
      cellDiv.segNum = seg;
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
}

function updateOptions(cellDiv) {
  const cellDivs = new Set(cellDiv.row.concat(cellDiv.col, cellDiv.seg));
  cellDivs.forEach((c) => {
    c.options = getOptions(c);
    c.title = [...c.options].join();
  });
}

function cellClick(cellDiv) {
  setCell(cellDiv, selectedNum);

  if (checkCompletion()) {
    setTimeout(() => alert('You Win!'), 100);
  }
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
  return gridCells.every(
    (cellDiv) => cellDiv.innerHTML != '' && !cellDiv.className.includes('Error')
  );
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
    return new Set();
  }
  const options = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  celldiv.col.forEach((c) => options.delete(c.innerHTML));
  celldiv.row.forEach((c) => options.delete(c.innerHTML));
  celldiv.seg.forEach((c) => options.delete(c.innerHTML));

  return options;
}

function solve() {
  return gridCells
    .reduce((acc, cellDiv) => {
      if (cellDiv.innerHTML != '') {
        return acc;
      }
      if (cellDiv.options.size == 1) {
        acc.push({ cellDiv, value: [...cellDiv.options][0] });
      }
      let optionsRemaining = getCellsUniqueOptions(cellDiv, cellDiv.col);
      if (optionsRemaining.size == 1) {
        acc.push({ cellDiv, value: [...optionsRemaining][0] });
      } else {
        optionsRemaining = getCellsUniqueOptions(cellDiv, cellDiv.row);
        if (optionsRemaining.size == 1) {
          acc.push({ cellDiv, value: [...optionsRemaining][0] });
        } else {
          optionsRemaining = getCellsUniqueOptions(cellDiv, cellDiv.seg);
          if (optionsRemaining.size == 1) {
            acc.push({ cellDiv, value: [...optionsRemaining][0] });
          }
        }
      }
      return acc;
    }, [])
    .reduce((acc, update) => {
      setCell(update.cellDiv, update.value);
      return acc + 1;
    }, 0);
}

function getCellsUniqueOptions(cellDiv, group) {
  const cellsOptions = new Set(cellDiv.options);
  group.forEach((c) => {
    if (c != cellDiv) {
      [...c.options].forEach((o) => cellsOptions.delete(o));
    }
  });
  return cellsOptions;
}

function advancedEliminations() {
  obviousSets();
  hiddenSets();
}

function obviousSets() {
  const gridGroups = [gridSegments, gridRows, gridColumns];
  gridGroups.forEach((gridGroup) => {
    gridGroup.forEach((group) => {
      const maxSize = group.filter((cellDiv) => cellDiv.innerHTML == '').length;
      for (let setSize = 2; setSize < maxSize; setSize++) {
        const cellsToSearch = group.filter(
          (cellDiv) =>
            cellDiv.options.size > 1 && cellDiv.options.size <= setSize
        );
        getCombinations(cellsToSearch, setSize).forEach((combination) => {
          const combinationOptions = mergedCellOptions(combination);

          if (combinationOptions.size == setSize) {
            removeOptionsFromGroup(group, combinationOptions, combination);
          }
        });
      }
    });
  });
}

function hiddenSets() {
  const gridGroups = [gridSegments, gridRows, gridColumns];
  gridGroups.forEach((gridGroup) => {
    gridGroup.forEach((group) => {
      const maxSize = group.filter((cellDiv) => cellDiv.innerHTML == '').length;
      for (
        let combinationSize = 2;
        combinationSize < maxSize;
        combinationSize++
      ) {
        const cellsToSearch = group.filter(
          (cellDiv) => cellDiv.options.size >= 1
        );
        getCombinations(
          [...mergedCellOptions(cellsToSearch)],
          combinationSize
        ).forEach((combination) => {
          const cellsWithCombination = group.filter((cellDiv) =>
            combination.some((option) => cellDiv.options.has(option))
          );
          if (cellsWithCombination.length == combinationSize) {
            removeOptionsFromCells(cellsWithCombination, combination);
          }
        });
      }
    });
  });
}

function pointingPairs() {
  const group = gridSegments[0];
  const allUniqueOptions = mergedCellOptions(group);
  // allUniqueOptions.forEach((option) => {
  const option = '4';
  const cellsWithOption = group.filter((cellDiv) =>
    cellDiv.options.has(option)
  );
  console.log({ group }, { cellsWithOption });
  if (
    cellsWithOption.length > 0 &&
    cellsWithOption.every((cellDiv) => cellDiv.col == cellsWithOption[0].col)
  ) {
    removeOptionsFromGroup(cellsWithOption[0].col, option, cellsWithOption);
    console.log({ option, cellsWithOption });
  }
  if (
    cellsWithOption.length > 0 &&
    cellsWithOption.every((cellDiv) => cellDiv.row == cellsWithOption[0].row)
  ) {
    removeOptionsFromGroup(cellsWithOption[0].row, option, cellsWithOption);
    console.log({ option, cellsWithOption });
  }
  if (
    cellsWithOption.length > 0 &&
    cellsWithOption.every((cellDiv) => cellDiv.seg == cellsWithOption[0].seg)
  ) {
    removeOptionsFromGroup(cellsWithOption[0].seg, option, cellsWithOption);
    console.log({ option, cellsWithOption });
  }
  // });
}

function mergedCellOptions(cellDivs) {
  return new Set(cellDivs.flatMap((c) => [...c.options]));
}

function getCombinations(array, size) {
  if (array.length < size) return [];

  const result = [];

  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (size == 1) {
      result.push([element]);
    } else {
      const remaining = array.slice(index + 1);
      const next = getCombinations(remaining, size - 1);
      next.forEach((n) => result.push([element, ...n]));
    }
  }

  return result;
}

function removeOptionsFromGroup(group, optionsToRemove, excludingCells = []) {
  group.forEach((cellDiv) => {
    if (excludingCells.includes(cellDiv)) {
      return;
    }
    [...optionsToRemove].forEach((option) => {
      cellDiv.options.delete(option);
      cellDiv.title = [...cellDiv.options].join();
    });
  });
}

function removeOptionsFromCells(cellDivs, optionsToKeep = []) {
  cellDivs.forEach((cellDiv) => {
    [...cellDiv.options].forEach((option) => {
      if (!optionsToKeep.includes(option)) {
        cellDiv.options.delete(option);
        cellDiv.title = [...cellDiv.options].join();
      }
    });
  });
}

function autoFinish() {
  let loopCounter = 0;
  while (!checkCompletion()) {
    if (solve() == 0) {
      advancedEliminations();
    }

    //We need this until we have written all of the advancedEliminations
    if (++loopCounter >= 100) {
      console.log(`autoFinish aborted after ${loopCounter} attempts!`);
      return;
    }
  }
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
    GRID_2:
      ' 5 1 6 3 7 2 8 1 6 6 3  47 2 7  1  5 9     1 5  9  8 2 21  8 4 4 6 9 5 1 8 6 4 2 ',
  },
  MODERATE: {
    GRID_1:
      '47    36 6  4 2  9     32 4 8  7 94    3 6    54 2  1 7 18     9  6 4  7 45    91',
    GRID_2:
      '8 49  5     41  8 1   8   479 2 1    12   79    5 9 235   2   7 7  98     6  38 2',
  },
  HARD: {
    GRID_1:
      ' 2 6  4   137         3    9   8 6   5 4 2 9   7 9   8    1     4   825   9  6 7 ',
    GRID_2:
      ' 64 2 97    6 8   7       1 5     4 4  7 3  6 7     5 9       7   2 9    25 4 68 ',
  },
  TEST: {
    OBVIOUS_SETS:
      '  2 85  4    3  6   421  3        52      31 9        8    6   25 4    8     16  ',
    OBVIOUS_TRIPLES:
      '37     9 9   7       42   6  1 842           8  6   5   6  2 1        39 5    4  ',
    HIDDEN_SETS:
      '  9 32      7     162       1  2 56    9      5    1 7      4 3 26  9     587    ',
    POINTING_PAIRS:
      '  9 7     8 4       3    281     67  2  13 4  4   78  6   3     1             284',
  },
};

loadGrid(EXAMPLES.TEST.POINTING_PAIRS);
