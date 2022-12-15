<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        Игры
      </h3>
    </header>

    <ul>
      <li v-for="game in games" :key="game.id">
        <router-link :to="`/games/${game.id}`">{{ game.name }}</router-link> - Игра создана: {{ game.date }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  data: () => ({
      games: [
        {
          'id': 1,
          'name': 'Иванов',
          'date': '15.12.2022 10:20'
        },
        {
          'id': 2,
          'name': 'Петров',
          'date': '15.12.2022 10:25'
        },
        {
          'id': 3,
          'name': 'Сидоров',
          'date': '15.12.2022 10:26'
        },
        {
          'id': 4,
          'name': 'Леонтьев',
          'date': '15.12.2022 10:30'
        }
      ],
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  }
};
</script>
