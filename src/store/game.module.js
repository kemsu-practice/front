//import GameService from '../services/game.service';

const initialState = {
  enemyBoard: {
    active: true,
    cells: [],
  },
  playerBoard: {
    active: false,
    errors: [],
    cells: [],
  }
};

function safeGetCell(matrix, row, col) {
  if(!matrix[row]) {
    return {}
  }
  if(!matrix[row][col]) {
    return {}
  }
  return matrix[row][col]
}

function findAllCellsOfFigure(cell, matrix, figure) {
  if(!cell || !cell.filled) {
    return figure;
  }
  if(figure.some(item => item.row === cell.row && item.col === cell.col)) {
    return figure;
  }

  figure.push({...cell});

  let checkCell;
  checkCell = safeGetCell(matrix, cell.row-1, cell.col);
  findAllCellsOfFigure(checkCell, matrix, figure)
  checkCell = safeGetCell(matrix, cell.row+1, cell.col);
  findAllCellsOfFigure(checkCell, matrix, figure)
  checkCell = safeGetCell(matrix, cell.row, cell.col-1);
  findAllCellsOfFigure(checkCell, matrix, figure)
  checkCell = safeGetCell(matrix, cell.row, cell.col+1);
  findAllCellsOfFigure(checkCell, matrix, figure)
  return figure
}

function checkSizes(cells) {
  const matrix = [];
  for(const cell of cells.filter(item => item.filled)) {
    if(!matrix[cell.row]) {
      matrix[cell.row] = [];
    }
    matrix[cell.row][cell.col] = cell;
  }
  const found = [];
  const figures = [];

  for(const row in matrix) {
    for(const col in matrix[row]) {
      const cell = matrix[row][col];
      if(found.some(item => item.row === cell.row && item.col === cell.col)) {
        continue;
      }
      const newFigure = findAllCellsOfFigure(cell, matrix, []);
      for(const cell of newFigure) {
        found.push(cell)
      }
      figures.push(newFigure)
    }
  }
  console.log(figures)
  const sizeCounts = [
    0,
    4,
    3,
    2,
    1
  ]
  for(const figure of figures) {
    if(!sizeCounts[figure.length]) {
      sizeCounts[figure.length] = 0;
    }
    sizeCounts[figure.length]--;
  }
  const errors = [];
  for(const idx in sizeCounts) {
    if(idx > 4) {
      errors.push('Слишком большой корабль: '+idx)
      continue;
    }
    if(sizeCounts[idx] < 0) {
      errors.push('Слишком много кораблей размера: '+idx + ', нужно убрать еще: '+ -sizeCounts[idx])
    }
    if(sizeCounts[idx] > 0) {
      errors.push('Слишком мало кораблей размера: '+idx + ', нужно добавить еще: '+sizeCounts[idx])
    }
  }
  return errors;
}

export const game = {
  namespaced: true,
  state: initialState,
  actions: {
    setCellFilled({commit}, {row, col, board}) {
      commit('setCellFilled', {row, col, board})
    },
    setActive({commit}) {
      commit('setActive')
    },
    setCellFired({commit}, {row, col, board}) {
      commit('setCellFired', {row, col, board})
    },
    setCellMissed({commit}, {row, col, board}) {
      commit('setCellMissed', {row, col, board})
    }
  },
  mutations: {
    setCellFilled(state, {row, col}) {
      let cell = state.playerBoard.cells.find(item => item.row === row && item.col === col)
      if(!cell) {
        cell = {row, col}
        state.playerBoard.cells.push(cell)
      }
      cell.filled = !cell.filled;
      state.playerBoard.errors = checkSizes(state.playerBoard.cells)
    },
    setCellFired(state, {row, col, board}) {
      let stateBoard;
      if(board === 'enemy') {
        stateBoard = state.enemyBoard;
      }
      else if(board === 'player') {
        stateBoard = state.playerBoard;
      }
      let cell = stateBoard.cells.find(item => item.row === row && item.col === col)
      if(!cell) {
        cell = {row, col}
        stateBoard.cells.push(cell)
      }
      cell.fired = true;
    },
    setCellMissed(state, {row, col, board}) {
      let stateBoard;
      if(board === 'enemy') {
        stateBoard = state.enemyBoard;
      }
      else if(board === 'player') {
        stateBoard = state.playerBoard;
      }
      console.log(row, col, board)
      let cell = stateBoard.cells.find(item => item.row === row && item.col === col)
      if(!cell) {
        cell = {row, col}
        stateBoard.cells.push(cell)
      }
      if(cell.missed) {
        cell.fired = true
      }
      cell.missed = true;
    },
    setActive(state) {
      state.playerBoard.active = true
    }
  }
};
