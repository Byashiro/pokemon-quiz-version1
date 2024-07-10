<template>
  <main class="pokemon-page-container" :style="{ backgroundImage: `${pokeBgImg}`}">
    <router-view />
  </main>
</template>

<script>
import PokemonPage from './pages/PokemonPage'
import { getCurrentTime } from './helpers/getCurrentTime'
import { pokeDataStore } from '@/store/pokeDataStore';
import { storeToRefs } from 'pinia';

export default {
  name: 'App',
  components: {
    PokemonPage
  },
  setup() {
    const store = pokeDataStore();
    const { pokeBgImg } = storeToRefs(store);

    const getBackgroundImg = () => {
      const pokeRoute = getCurrentTime();
      store.setPokeBgImg(pokeRoute);
    };

    return {
      getBackgroundImg,
      pokeBgImg    
    }
  },
  // watch(){
  //   this.getBackgroundImg();
  // }

  mounted() {
    // if (  ) {
    // }
    this.getBackgroundImg();
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.pokemon-page-container {
  align-items: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100%;
}
</style>
