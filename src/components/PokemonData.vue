<template>
  <article class="modal-pokemon">
    <section class="modal-pokemon-container">
      <header>
        <h1>¡Felicidades, el Pokémon es {{ pokeData.name.toUpperCase() }}!</h1>
      </header>
      <article class="sct-pokemon">
        <section class="pokemon-img-container">
          <h3 class="poke-id-name">#{{ pokeData.id }} {{ pokeData.name.toUpperCase() }}</h3>
          <pokemon-picture ref="pokemonImage" 
            :pokemonId="pokeData.id" 
            :showPokemon="showPokemon" 
            @click="pokemonAudio" 
            class="poke-img"
          />          
          <h3 class="poke-type-title">Tipo(s):</h3>
          <ul class="poke-type-ul">
            <li v-for="(pokeType, index) in pokeData.types" :key="index" class="poke-types-li"
            :style="{ backgroundColor: typeColours[pokeType.toLowerCase()] }"
            >
              {{ typePokeEs[pokeType.toLowerCase()] }}
            </li>
          </ul>
        </section>
        <section class="pokemon-data-container">
          <div class="div-nav-container">
            <nav class="poke-nav-container">
              <router-link
                class="poke-route-link"
                :class="{ 'is-active': activeLink === 'pokemon-description' }"
                :to="{ 
                  name: 'pokemon-description', 
                  params: { id: pokeData.id }
                } "
                @click="setActiveLink('pokemon-description')"
                :style="{ backgroundColor: typeColor, filter: `brightness(90%)` }"
              >
              Descripción
              </router-link>

              <router-link 
                class="poke-route-link"
                :class="{ 'is-active': activeLink === 'pokemon-stats' }"
                :to="{ 
                  name: 'pokemon-stats', 
                  params: { id: pokeData.id }
                }"
                @click="setActiveLink('pokemon-stats')"
                :style="{ backgroundColor: typeColor, filter: `brightness(90%)` }"
              >
                Estadísticas
              </router-link>

              <router-link 
                class="poke-route-link"
                :class="{ 'is-active': activeLink === 'pokemon-weaknesses' }"
                :to="{ 
                  name: 'pokemon-weaknesses', 
                  params: { id: pokeData.id } 
                }"
                @click="setActiveLink('pokemon-weaknesses')"
                :style="{ backgroundColor: typeColor, filter: `brightness(90%)` }"
              >
                Debilidades y resistencias
              </router-link>

              <router-link 
                class="poke-route-link"
                :class="{ 'is-active': activeLink === 'pokemon-moves' }"
                :to="{ 
                  name: 'pokemon-moves', 
                  params: { id: pokeData.id } 
                }"
                @click="setActiveLink('pokemon-moves')"
                :style="{ backgroundColor: typeColor, filter: `brightness(90%)` }"
              >
                Movimientos
              </router-link>
            </nav>
          </div>
          <div class="poke-data-info-container">
              <router-view />
          </div>
        </section>
      </article>
      <footer>
        <button class="btn-again" @click="newGame">Volver a intentarlo</button>
      </footer>      
    </section>
  </article>
</template>

<script>
  // import PokemonPage from '@/pages/PokemonPage';
  import PokemonPicture from '@/components/PokemonPicture';
  import { colours } from '@/helpers/pokeTypesColours';
  import { typePokeEs } from '@/helpers/pokeTypesEs';

  export default {
    components: {
      // PokemonPage,
      PokemonPicture,
    },
    data() {
      return {
        showPokemon: true,
        activeLink: 'pokemon-description',
      }
    },
    props: {
      pokeData: {
        type: Object,
        required: true
      },
      pokemonAudio: {
        type: Function,
        required: true
      },
      newGame: {
        type: Function,
        required: true
      }
    },
    created() {
      const pokemonId = this.pokeData.id;
      this.$router.push(`/pokemon-page/pokemon-data/pokemon-description/${pokemonId}`);
    },
    methods: {
      setActiveLink(linkName) {
        this.activeLink = linkName;
      }
    },
    computed: {
      typeColours() {
        return colours;        
      },
      typePokeEs() {
        return typePokeEs;
      },
      typeColor() {
        if (this.pokeData.types && this.pokeData.types.length > 0) {
          const firstType = this.pokeData.types[0].toLowerCase();
            return this.typeColours[firstType];
        } else {
          return 'none';
        }
      },
    }
  }
</script>

<style scoped>
  @import url('@/css/styles-components.css');

  .modal-pokemon {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
    z-index: 999;
    position: fixed;
    display: flex;
    backdrop-filter: blur(10px);
    justify-content: center;
    align-items: center;
    transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
  }
  h1 {
    top: 0;
    padding: 0;
    margin: 0;
    text-shadow: 0 0 0px #000000;
  }
  .modal-pokemon-container {
    width: 80%;
    height: 80%;
    padding: 20px;
    display: block;
    overflow: auto;
    justify-content: center;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.7);
  }
  .sct-pokemon {
    display: flex;
    justify-content: space-between;
    padding: 20px 0px;
    width: 100%;
  }
  .poke-id-name, .poke-data-title, .poke-type-title   {
    margin: 10px 10px;
    text-shadow: 0 0 0px #000000;
  }
  .pokemon-img-container {
    height: 400px;
    width: 400px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.7);
  }
  .poke-type-ul {
    display: flex;
    list-style-type: none;
    justify-content: center;
    margin: 0;
    padding: 0;
  }
  .poke-types-li {
    color: #000000;
    text-shadow: 0 0 0px #000000;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    margin: 0 15px;
    border-radius: 20px;
    padding: 10px;
    width:  40%;
  }
  .poke-img {
    position: relative;
    margin: 0 auto;
  }
  .pokemon-data-container {
    align-items: center;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.7);
    display: flex;
    flex-direction: column;
    height: 400px;
    width: 600px;
  }
  .div-nav-container {
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.7);
    margin: 20px 0px;
    width: 90%;
  }
  .poke-nav-container {
    display: flex;
    overflow-x: auto;
    padding: auto;
  }
  .poke-route-link {
    color: #000000;
    padding: 20px;
    margin: auto;
    text-decoration: none;
    white-space: nowrap;
  }
  .is-active {
    /* border: 1px solid #000000; */
    /* box-shadow: 0 0 10px 0 #000000; */
    color: #ffffff !important;
    filter: brightness(100%) !important;
    text-shadow: 2px 2px 10px #000000 !important;
  }
  .poke-route-link:hover {
    /* background-color: rgb(0, 0, 0, 0.5) !important; */
    /* box-shadow: 0 0 10px 0 #000000; */
    color: #ffffff !important;
    filter: brightness(100%) !important;
    text-shadow: 2px 2px 10px #000000 !important;
  }
  .poke-data-info-container {
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.7);
    height: 90%;
    justify-content: center;
    margin-bottom: 20px;
    overflow-y: auto;
    width: 90%;
  }
  .modal-pokemon-container::-webkit-scrollbar,
  .poke-data-info-container::-webkit-scrollbar,
  .poke-nav-container::-webkit-scrollbar {
    width: 10px;
    height: 8px;
  }
  .modal-pokemon-container::-webkit-scrollbar-thumb,
  .poke-data-info-container::-webkit-scrollbar-thumb,
  .poke-nav-container::-webkit-scrollbar-thumb {
    background: #888888;
    border-radius: 5px;
  }
  @media (max-width: 800px) {
    .sct-pokemon {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      row-gap: 20px;
      height: auto;
    }
    .sct-pokemon, 
    .pokemon-img-container, 
    .pokemon-data-container {
      width: 100%;
    }
    .poke-nav-container {
      /* align-items: center; */
      /* display: flex; */
      /* justify-content: space-between; */
      /* flex-direction: column; */
    }
    .poke-nav-container a {
      /* margin: 10px 0; */
      /* align-items: center; */
    }
  }
</style>