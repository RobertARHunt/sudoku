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
      cellDiv.col = gridColumns[col];
      cellDiv.row = gridRows[row];
      cellDiv.seg = gridSegments[seg];
      cellDiv.options = new Set();
      cellDiv.onclick = () => cellClick(cellDiv);
      if (seg % 2) {
        cellDiv.classList.add('oddSeg');
      }

      cellDiv.valueDiv = document.createElement('div');
      cellDiv.valueDiv.classList.add('CellValue');
      cellDiv.appendChild(cellDiv.valueDiv);

      cellDiv.optionDiv = document.createElement('div');
      cellDiv.optionDiv.classList.add('CellOptions');
      cellDiv.appendChild(cellDiv.optionDiv);

      gridCells.push(cellDiv);
      gridColumns[col].push(cellDiv);
      gridRows[row].push(cellDiv);
      gridSegments[seg].push(cellDiv);

      domMainGrid.appendChild(cellDiv);
    }
  }
}

prepareGrid();

function getCellValue(cellDiv) {
  return cellDiv.valueDiv.textContent;
}

function setCellValue(cellDiv, value) {
  cellDiv.valueDiv.textContent = value;

  updateOptions(cellDiv);

  checkCells(cellDiv.seg, 'segmentError');
  checkCells(cellDiv.row, 'rowError');
  checkCells(cellDiv.col, 'colError');
}

function setCellOptions(cellDiv, newOptions) {
  cellDiv.options = newOptions;
  cellDiv.optionDiv.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .map((n) => n.toString())
    .map((s) => (cellDiv.options.has(s) ? s : '&nbsp;'))
    .join('');
}

function deleteCellOption(cellDiv, optionToDelete) {
  cellDiv.options.delete(optionToDelete);
  cellDiv.optionDiv.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .map((n) => n.toString())
    .map((s) => (cellDiv.options.has(s) ? s : '&nbsp;'))
    .join('');
}

function updateOptions(cellDiv) {
  const cellDivs = new Set(cellDiv.row.concat(cellDiv.col, cellDiv.seg));
  cellDivs.forEach((c) => {
    setCellOptions(c, getOptions(c));
  });
}

function getOptions(cellDiv) {
  if (getCellValue(cellDiv) != '') {
    return new Set();
  }
  const options = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  cellDiv.col.forEach((c) => options.delete(getCellValue(c)));
  cellDiv.row.forEach((c) => options.delete(getCellValue(c)));
  cellDiv.seg.forEach((c) => options.delete(getCellValue(c)));

  return options;
}

function cellClick(cellDiv) {
  setCellValue(cellDiv, selectedNum);

  if (checkCompletion()) {
    setTimeout(() => alert('You Win!'), 100);
  }
}

function checkCells(cellDivs, errorClass) {
  const values = cellDivs.map((c) => getCellValue(c));
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
    (cellDiv) =>
      getCellValue(cellDiv) != '' && !cellDiv.className.includes('Error')
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

function solve() {
  const solutions = gridCells.reduce((acc, cellDiv) => {
    if (cellDiv.options.size == 1) {
      acc.push({ cellDiv, value: [...cellDiv.options][0] });
    }
    return acc;
  }, []);
  solutions.forEach((s) => setCellValue(s.cellDiv, s.value));
  return solutions.length;
}

function advancedEliminations() {
  obviousSets();
  hiddenSets();
  pointingSets();
  wingSets();
  yWing();
}

function obviousSets() {
  const gridGroups = [gridSegments, gridRows, gridColumns];
  gridGroups.forEach((gridGroup) => {
    gridGroup.forEach((group) => {
      const maxSize = group.filter(
        (cellDiv) => getCellValue(cellDiv) == ''
      ).length;
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
      const maxSize = group.filter(
        (cellDiv) => getCellValue(cellDiv) == ''
      ).length;
      for (
        let combinationSize = 1;
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

function pointingSets() {
  const gridGroups = [gridSegments, gridRows, gridColumns];
  gridGroups.forEach((gridGroup) => {
    gridGroup.forEach((group) => {
      const allUniqueOptions = mergedCellOptions(group);
      allUniqueOptions.forEach((option) => {
        const cellsWithOption = group.filter((cellDiv) =>
          cellDiv.options.has(option)
        );
        if (gridGroup == gridSegments) {
          if (
            cellsWithOption.length > 1 &&
            cellsWithOption.every(
              (cellDiv) => cellDiv.col == cellsWithOption[0].col
            )
          ) {
            removeOptionsFromGroup(
              cellsWithOption[0].col,
              option,
              cellsWithOption
            );
          } else if (
            cellsWithOption.length > 1 &&
            cellsWithOption.every(
              (cellDiv) => cellDiv.row == cellsWithOption[0].row
            )
          ) {
            removeOptionsFromGroup(
              cellsWithOption[0].row,
              option,
              cellsWithOption
            );
          }
        } else if (
          cellsWithOption.length > 1 &&
          cellsWithOption.every(
            (cellDiv) => cellDiv.seg == cellsWithOption[0].seg
          )
        ) {
          removeOptionsFromGroup(
            cellsWithOption[0].seg,
            option,
            cellsWithOption
          );
        }
      });
    });
  });
}

function wingSets() {
  function optionIndeces(cellDivs, option) {
    return cellDivs.reduce((acc, cellDiv, ix) => {
      if (cellDiv.options.has(option)) {
        return [...acc, ix];
      } else {
        return acc;
      }
    }, []);
  }

  const gridGroups = [gridRows, gridColumns];
  gridGroups.forEach((gridGroup) => {
    for (let option = 1; option <= 9; option++) {
      const optionString = option.toString();

      const candidateGroups = gridGroup
        .map((group) => ({
          group,
          optionIndeces: optionIndeces(group, optionString),
        }))
        .filter(({ optionIndeces }) => optionIndeces.length == 2);

      for (let size = 2; size <= 3; size++) {
        const combinations = getCombinations(candidateGroups, size)
          .map((groups) => ({
            groups,
            uniqueIndeces: new Set(
              groups.flatMap((candidateGroup) => candidateGroup.optionIndeces)
            ),
          }))
          .filter((combination) => combination.uniqueIndeces.size == size);

        combinations.forEach((combination) => {
          const cellsInWingSet = combination.groups.flatMap(
            (combinationGroup) =>
              combinationGroup.optionIndeces.map(
                (ix) => combinationGroup.group[ix]
              )
          );

          if (gridGroup == gridRows) {
            cellsInWingSet
              .map((cellDiv) => cellDiv.col)
              .filter(onlyUnique)
              .forEach((col) =>
                removeOptionsFromGroup(col, [optionString], cellsInWingSet)
              );
          } else {
            cellsInWingSet
              .map((cellDiv) => cellDiv.row)
              .filter(onlyUnique)
              .forEach((row) =>
                removeOptionsFromGroup(row, [optionString], cellsInWingSet)
              );
          }
        });
      }
    }
  });
}

function yWing() {
  const candidateCells = gridCells.filter(
    (cellDiv) => cellDiv.options.size == 2
  );

  candidateCells.forEach((pivot) => {
    if (pivot.options.size != 2) return;

    const candidateRowPincers = candidateCells.filter(
      (c) =>
        c != pivot &&
        c.row == pivot.row &&
        mergedCellOptions([c, pivot]).size == 3
    );
    const candidateColumnPincers = candidateCells.filter(
      (c) =>
        c != pivot &&
        c.col == pivot.col &&
        mergedCellOptions([c, pivot]).size == 3
    );
    const candidateSegmentPincers = candidateCells.filter(
      (c) =>
        c != pivot &&
        c.seg == pivot.seg &&
        mergedCellOptions([c, pivot]).size == 3
    );

    const groupPairs = getCombinations(
      [candidateRowPincers, candidateColumnPincers, candidateSegmentPincers],
      2
    );

    groupPairs.forEach(([group1, group2]) => {
      group1.forEach((pincer1) => {
        group2.forEach((pincer2) => {
          if (
            pincer1 != pincer2 &&
            mergedCellOptions([pincer1, pincer2, pivot]).size == 3 &&
            mergedCellOptions([pincer1, pincer2]).size == 3
          ) {
            const intersections = getPincerIntersections(pincer1, pincer2);
            const optionsToRemove = optionsExcept(
              mergedCellOptions([pincer1, pincer2]),
              pivot.options
            );
            console.log('yWing:', { pivot, pincer1, pincer2 });
            removeOptionsFromGroup(intersections, optionsToRemove);
          }
        });
      });
    });
  });
}

function getPincerIntersections(pincer1, pincer2) {
  if (pincer1.row == pincer2.row || pincer1.col == pincer2.col) return [];

  const intersections = [];
  pincer1.row.forEach((cellDiv) => {
    if (cellDiv.col == pincer2.col) {
      intersections.push(cellDiv);
    }
  });
  pincer1.col.forEach((cellDiv) => {
    if (cellDiv.row == pincer2.row) {
      intersections.push(cellDiv);
    }
  });
  return intersections;
}

function mergedCellOptions(cellDivs) {
  return new Set(cellDivs.flatMap((c) => [...c.options]));
}

function optionsExcept(options, optionsToExclude) {
  return [...options].filter((option) => !optionsToExclude.has(option));
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
      deleteCellOption(cellDiv, option);
    });
  });
}

function removeOptionsFromCells(cellDivs, optionsToKeep = []) {
  cellDivs.forEach((cellDiv) => {
    [...cellDiv.options].forEach((option) => {
      if (!optionsToKeep.includes(option)) {
        deleteCellOption(cellDiv, option);
      }
    });
  });
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function autoFinish() {
  const startTime = Date.now();

  let loopCounter = 0;
  while (!checkCompletion()) {
    if (solve() == 0) {
      advancedEliminations();
    }

    //We need this until we have written all of the advancedEliminations
    if (++loopCounter >= 100) {
      alert(`autoFinish aborted after ${loopCounter} attempts!`);
      return;
    }
  }

  const seconds = (Date.now() - startTime) / 1000;
  alert(`Solved in ${seconds} seconds.`);
}

function bruteForce() {
  const startTime = Date.now();

  const DIRECTION = {
    FORWARDS: 1,
    BACKWARDS: 2,
  };
  let cellIndex = 0;
  let direction = DIRECTION.FORWARDS;

  const backStack = [];

  while (!checkCompletion()) {
    if (direction == DIRECTION.FORWARDS) {
      //FORWARDS
      if (gridCells[cellIndex].valueDiv.textContent != '') {
        cellIndex++;
      } else {
        const [nextOption, ...remainingOptions] = [
          ...gridCells[cellIndex].options,
        ];
        if (nextOption) {
          setCellValue(gridCells[cellIndex], nextOption);
          backStack.push([cellIndex, remainingOptions]);
          cellIndex++;
        } else {
          direction = DIRECTION.BACKWARDS;
        }
      }
    } else {
      //BACKWARDS
      const [backCellIndex, backRemainingOptions] = backStack.pop();
      const [newNext, ...newRemaining] = backRemainingOptions;
      if (newNext) {
        cellIndex = backCellIndex;
        setCellValue(gridCells[cellIndex], newNext);
        backStack.push([cellIndex, newRemaining]);
        cellIndex++;
        direction = DIRECTION.FORWARDS;
      } else {
        setCellValue(gridCells[backCellIndex], '');
      }
    }
  }

  const seconds = (Date.now() - startTime) / 1000;
  alert(`Solved in ${seconds} seconds.`);
}

function printGrid() {
  console.log(
    gridCells
      .map((c) => (getCellValue(c) == '' ? ' ' : getCellValue(c)))
      .join('')
  );
}

function loadGrid(input) {
  input.split('').forEach((v, i) => setCellValue(gridCells[i], v.trim()));
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
    GRID_3:
      '2     4       9  7  9 8  65 8   5 9   51682   3 2   5 91  7    4  6       3     6',
    GRID_4:
      '   3    2 5  27  9      1 8  6  4   349   561   9  4  9 4      2  51  7 1    9   ',
    GRID_5:
      '328        1  4    4  2   5    731    96 17    329    7   8  2    3 74        576',
    GRID_6:
      '    9   55      7  816  2       618    123    147    2  3  269  9      41   4    ',
    GRID_99:
      '8          36      7  9 2   5   7       457     1   3   1    68  85   1  9    4  ',
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
    X_WING:
      '  38  51   87  93 1  3 5728   2  8498 19 6257   5  163964127385382659471 1 4  692',
    Y_WING:
      '9  2  75  5 69 23142        9         2       7   6    69  1   51   3   2 7 8   9',
    SWORD_FISH:
      '9 87351   1 98  3     2  988 546931  9  7     4325 9  25  9   1 89512 63  1847  9',
  },
};

loadGrid(EXAMPLES.HARD.GRID_99);
