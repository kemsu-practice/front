import GamesService from '../services/games.service';

const initialState = {
  games: []
};

export const games = {
  namespaced: true,
  state: initialState,
  actions: {
    fetch({commit}) {
      GamesService.list().then(({data: { games }}) => {
          commit('setGames', {games})
        }
      )
    }
  },
  mutations: {
    setGames(state, {games}) {
      state.games = games;
    },
  }
};
