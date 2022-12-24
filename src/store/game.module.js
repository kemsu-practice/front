//import GameService from '../services/game.service';

import GamesService from "@/services/games.service";
import checkField from "@/services/checkField";

const initialState = {
  enemyBoard: {
    active: false,
    cells: [],
    shots: [],
  },
  playerBoard: {
    active: false,
    errors: [],
    cells: [],
    shots: [],
  },
  turn: null,

  id: null,
  playerUser: null,
  enemyUser: null,
  status: null,
  playerStatus: null,
  enemyStatus: null
};

export const game = {
  namespaced: true,
  state: initialState,
  actions: {
    fetch({commit}, {id}) {
      return GamesService.get(id).then(({data: { game }}) => {
          commit('setGame', {game})
        }
      )
    },
    setCellFilled({commit}, {row, col, board}) {
      commit('setCellFilled', {row, col, board})
    },
    setActive({commit}, {board}) {
      commit('setActive', {board})
    },
    setCellFired({commit}, {row, col, board}) {
      commit('setCellFired', {row, col, board})
    },
    setCellMissed({commit}, {row, col, board}) {
      commit('setCellMissed', {row, col, board})
    },
    setTurn({commit}, {turn}) {
      commit('setTurn', {turn})
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
      state.playerBoard.errors = checkField(state.playerBoard.cells)
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
    setActive(state, {board}) {
      let stateBoard;
      if(board === 'enemy') {
        stateBoard = state.enemyBoard;
      }
      else if(board === 'player') {
        stateBoard = state.playerBoard;
      }
      stateBoard.active = true
    },
    setTurn(state, {turn}) {
      state.turn = turn
    },
    setGame(state, {game}) {
      if(state.id !== game.id) {
        state.playerBoard.cells = [...game.playerFields.map(item => ({...item, filled: true}))];
        state.playerBoard.errors = checkField(state.playerBoard.cells)
      }
      state.playerBoard.shots = [...game.playerShots];
      state.enemyBoard.shots = [...game.enemyShots];

      state.id = game.id;
      state.playerUser = game.playerUser;
      state.enemyUser = game.enemyUser;
      state.status = game.status;
      state.playerStatus = game.playerStatus;
      state.enemyStatus = game.enemyStatus;
      state.turn = game.turn;

    }
  }
};
