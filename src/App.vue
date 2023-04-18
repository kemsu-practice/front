<template>
  <div id="app">
    <flash-message variant="success"></flash-message>
    <flash-message variant="danger"></flash-message>
    <flash-message variant="warning"></flash-message>

    <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
      <a href class="navbar-brand" @click.prevent>Морское сражение</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div v-if="!currentUser" class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/register" class="nav-link">
              <font-awesome-icon icon="user-plus"/>
              Регистрация
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link">
              <font-awesome-icon icon="sign-in-alt"/>
              Вход
            </router-link>
          </li>
        </div>

        <div v-if="currentUser" class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link to="/games" class="nav-link">
              <font-awesome-icon icon="gamepad"/>
              Активные игры
            </router-link>
          </li>
          <li class="nav-item">
              <span class="nav-link"><font-awesome-icon icon="user"/>
              {{ currentUser.name }}
              </span>
          </li>
          <li class="nav-item">
            <a class="nav-link" href @click.prevent="logOut">
              <font-awesome-icon icon="sign-out-alt"/>
              Выйти
            </a>
          </li>
        </div>
      </div>
    </nav>

    <div class="container" @click="f">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    },
    f() {
      this.flash({ message: 'some message', variant: 'success' });
      console.log('test', this.flash);
    }
  },
  mounted() {
    this.f();
  }
};
</script>
