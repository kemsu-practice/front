<template>
  <div class="container">
    <header class="jumbotron">
      <h3 v-if="againstPlayerName">
        Игра с {{ againstPlayerName }}
      </h3>
      <h3 v-else>
        Противника пока нет
      </h3>

      <button class="btn btn-success" @click="onJoin" v-if="canJoin">Присоединиться</button>
    </header>
    <section v-if="myGame">
      <h3 class="text-center" v-if="currentGame.status === 2">
        <span v-if="!playerTurn">Ход противника</span>
        <span v-if="playerTurn">Ваш ход</span>
      </h3>
      <section class="row">
        <div class="col-md-6">
          <h4 @click="$store.dispatch('game/setTurn', { turn: 'player' })">Ваше поле</h4>
          <table>
            <tr>
              <td></td>
              <td v-for="col in 10" :key="col" class="game-cell" :class="cellClass(0, col, boards[0])">
                {{ letters[col - 1] }}
              </td>
            </tr>
            <tr v-for="row in 10" :key="row">
              <td class="game-cell" :class="cellClass(row, 0, boards[0])">{{ row }}</td>
              <td v-for="col in 10" :key="col" class="game-cell" @mouseover="hoverCell(row, col, boards[0])"
                  :class="cellClass(row, col, boards[0])" @click="clickedCell(row, col, boards[0])">
                <span class="ship"></span>
                <span class="missed"></span>
                <span class="fired"></span>
              </td>
            </tr>
          </table>
          <ul>
            <li v-for="(error,idx) in boardErrors" :key="idx">{{ error }}</li>
          </ul>
          <button v-if="!boardErrors?.length && this.currentGame.playerStatus === 0"
                  class="btn btn-success" @click="clickedReady">
            Готов!
          </button>
        </div>
        <div class="col-md-6 text-md-right pt-4 pt-md-0" v-if="againstPlayerName">
          <h4
            @click="$store.dispatch('game/setActive', { board: 'enemy' }); $store.dispatch('game/setTurn', { turn: 'enemy' })">
            Поле противника
          </h4>
          <table class="float-md-right" v-if="this.currentGame.enemyStatus === 1">
            <tr>
              <td></td>
              <td v-for="col in 10" :key="col" class="game-cell" :class="cellClass(0, col, boards[1])">
                {{ letters[col - 1] }}
              </td>
            </tr>
            <tr v-for="row in 10" :key="row">
              <td class="game-cell" :class="cellClass(row, 0, boards[1])">{{ row }}</td>
              <td v-for="col in 10" :key="col" class="game-cell" @mouseover="hoverCell(row, col, boards[1])"
                  :class="cellClass(row, col, boards[1])" @click="clickedCell(row, col, boards[1])">
                <span class="ship"></span>
                <span class="missed"></span>
                <span class="fired">🞨</span>
              </td>
            </tr>
          </table>
          <div v-else class="game-wait">
            <h2>Противник расставляет корабли</h2>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>game

<script>

import GamesService from '../services/games.service';

class Board {
  constructor(owner) {
    this.owner = owner
    this.hoveredCol = null;
    this.hoveredRow = null;
    this.cells = [];
    for (let i = 1; i <= 10; i++) {
      const row = [];
      for (let j = 1; j <= 10; j++) {
        row.push({row: i, col: j, filled: false})
      }
      this.cells.push(row)
    }
  }
}

export default {
  name: 'Game',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    currentGame() {
      return this.$store.state.game;
    },
    boardErrors() {
      return this.$store.state.game.playerBoard.errors
    },
    myGame() {
      if (this.currentGame.enemyUser?.id === this.currentUser?.id || this.currentGame.playerUser?.id === this.currentUser?.id) {
        return true;
      }
      return false;
    },
    againstPlayerName() {
      if (this.currentGame.enemyUser && this.currentGame.enemyUser.id !== this.currentUser.id) {
        return this.currentGame.enemyUser.name;
      }
      if (this.currentGame.playerUser && this.currentGame.playerUser.id !== this.currentUser.id) {
        return this.currentGame.playerUser.name;
      }
      return null;
    },
    canJoin() {
      if (!this.myGame) {
        if (!this.currentGame.enemyUser || this.currentGame.playerUser) {
          return true;
        }
      }
      return false;
    },
    playerTurn() {
      return this.currentGame.turn === this.currentUser.id;
    }
  },
  data: () => ({
    letters: ['a', 'б', 'в', 'г', 'д', 'е', 'ж', 'з', 'и', 'к'],
    boards: [
      new Board('player'),
      new Board('enemy')
    ],
    gameFetchInterval: null
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
    this.$store.dispatch('game/setCellFilled', {})
    this.fetchGame();

    if(!this.gameFetchInterval) {
      this.gameFetchInterval = setInterval(() => {
        this.fetchGame();
      }, 1000)
    }
  },
  destroyed() {
    if(this.gameFetchInterval) {
      clearInterval(this.gameFetchInterval)
      this.gameFetchInterval = null;
    }
  },
  methods: {
    cellClasses: (cell) => {
      if (cell.filled) {
        return ['filled']
      }
    },
    hoverCell(row, col, board) {
      board.hoveredRow = row;
      board.hoveredCol = col;
    },
    cellClass(row, col, board) {
      const highlight = row === board.hoveredRow || col === board.hoveredCol
      const classes = []
      if (highlight) {
        classes.push('game-highlight')
      }
      const gameBoard = board.owner === 'player' ? this.currentGame.playerBoard : this.currentGame.enemyBoard;

      const cell = gameBoard.cells.find(item => item.row === row && item.col === col);
      if (cell && cell.filled) {
        classes.push('game-filled')
        if (cell.fired) {
          classes.push('game-filled-fired')
        }
      } else if (cell && cell.fired) {
        classes.push('game-fired')
      } else if (cell && cell.missed) {
        classes.push('game-missed')
      }
      const shot = gameBoard.shots.find(item => item.row === row && item.col === col);
      if (shot && !shot.Field) {
        classes.push('game-missed')
      }
      if (shot && shot.Field) {
        classes.push('game-fired')
      }

      return classes
    },
    async clickedCell(row, col, board) {
      if (board.owner === 'player' && this.currentGame.playerStatus === 0) {
        this.$store.dispatch('game/setCellFilled', {row, col})
      }
      if (board.owner === 'enemy' && this.currentGame.enemyStatus === 1) {
        await this.shot(row, col);
      }
    },
    clickedReady() {
      GamesService.sendField(this.$route.params.id, this.currentGame.playerBoard.cells)
      if (!this.boardErrors.length) {
        this.$store.dispatch('game/setActive', {board: 'player'})
      }
    },
    fetchGame() {
      return this.$store.dispatch('game/fetch', {id: this.$route.params.id})
    },
    async shot(row, col) {
      const r = await this.$store.dispatch('game/shot', {id: this.$route.params.id, row, col})
      console.log(r);
    },
    async onJoin() {
      await GamesService.join(this.$route.params.id)
      await this.fetchGame();
    }
  }
};
</script>

<style>
.game-wait {
  width: 331px;
  height: 331px;
  display: grid;
  align-items: center;
  text-align: center;
  float: right;
}

.game-cell {
  background: #cefff9;
  border: 1px solid #00ffe0;
  width: 30px;
  height: 30px;
  vertical-align: middle;
  text-align: center;
}

table:hover .game-cell.game-highlight {
  background: white;
}

.ship {
  display: none;
  width: 20px;
  height: 20px;
  background: black;
  vertical-align: middle;
}

.missed {
  display: none;
  width: 5px;
  height: 5px;
  background: black;
  border-radius: 5px;
  vertical-align: middle;
}

.fired {
  display: none;
  vertical-align: middle;
}

.game-filled .ship {
  display: inline-block;
}

.game-missed .missed {
  display: inline-block;
}

.game-fired .fired {
  display: inline-block;
}

.game-filled-fired .ship {
  background-color: red;
}
</style>
