import Vue from 'vue';
import Vuex from 'vuex';

import { auth } from './auth.module';
import { game } from './game.module';
import { games } from './games.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    game,
    games
  }
});
