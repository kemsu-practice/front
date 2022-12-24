<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        Игры
      </h3>
      <button class="btn btn-success" @click="onNewGame">Новая игра</button>
    </header>


    <ul class="list-group">
      <li v-for="game in games" :key="game.id" class="list-group-item">
        <router-link :to="`/games/${game.id}`">{{ game.player.name }}</router-link>
        <div class="float-right">
          <time-ago :datetime="game.createdAt" refresh locale="ru" long />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import GamesService from '../services/games.service';
import {TimeAgo} from 'vue2-timeago'

export default {
  name: 'Games',
  components: {TimeAgo},
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    games() {
      return this.$store.state.games.games
    }
  },
  data: () => ({}),
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
    this.$store.dispatch('games/fetch')
  },
  methods: {
    async onNewGame() {
      const {data} = await GamesService.create()
      this.$router.push(`/games/${data.game.id}`)
    }
  }
};
</script>
