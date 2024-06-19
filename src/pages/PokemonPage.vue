<template>
  <article class="page-container">
    <section class="poke-game-container">
      <h1 v-if="!pokemon">Espere por favor....</h1>
      <div class="quiz-container" v-else>
        <header>
          <h1>¿Quién es este Pokémon?</h1>
        </header>
        <article class="sct-pokemonquiz">
            <pokemon-picture :pokemonId="pokemon.id" :showPokemon="showPokemon" @click="pokemonAudio" class="poke-img"/>
            <pokemon-options :pokemons="pokemonArr" @selection="checkAnswer" :isDisabled="isDisabled" class="poke-options"/>
        </article>
        <footer>
          <button class="btn-again" @click="newGame">Nuevo Juego</button>
        </footer>
      </div>
    </section>
    <section class="poke-life-container">
      <div class="div-poke-life">
        <p class="p-poke-lifes"><b>Vidas</b></p>
        <img v-for="life in pokeLifes" :key="life" class="img-poke-life" src="@/assets/pokeball_life.gif">
      </div>
    </section>
  </article>

  <router-view 
    v-if="modal && answerCorrect"
    :pokeData="pokeData"
    :pokemonAudio="pokemonAudio"
    :newGame="newGame"
  />

  <again-game v-if="this.pokeLifes > 0 && modal && !answerCorrect"
    :modal="showAgainGameAlert"
    :pokemonName="pokemon.name"
    :againGame="againGame"
  />

  <new-game v-else-if="this.pokeLifes === 0 && modal && !answerCorrect"
    :modal="showNewGameAlert"
    :pokemonName="pokemon.name"
    :newGame="newGame"
  />
</template>

<script>
  import PokemonPicture from '@/components/PokemonPicture';
  import PokemonOptions from '@/components/PokemonOptions';
  import { getPokemonOptions } from '@/helpers/getPokemonOptions';
  import NewGame from '@/components/NewGame';
  import AgainGame from '@/components/AgainGame';

  export default {
    components: { 
      PokemonPicture,
      PokemonOptions,
      NewGame,
      AgainGame
    },
    data() {
      return {
        pokemonArr: [],
        pokemon: null,
        showPokemon: false,
        isDisabled: false,
        answerCorrect: false,
        modal: false,
        pokeData: {},
        pokeLifes: 3
      }
    },
    methods: {
      async mixPokemonArr() {
        try {
          const pokemons = await getPokemonOptions();
          this.pokemonArr = pokemons;
          const rndInt = Math.floor(Math.random() * pokemons.length);
          this.pokemon = pokemons[rndInt];
        } catch (error) {
          console.error('Error fetching Pokemon options:', error);
        }
      },
      async checkAnswer( selectedId ) {
        this.showPokemon = true;
        this.isDisabled = true;

        if( selectedId === this.pokemon.id ) {
          this.answerCorrect = true;
          this.modal = true;
          this.pokeData = this.pokemon;
        } else {
          this.pokeLifes--
          this.modal = true;
          this.pokemonName = this.pokemon.name;
        }
      },
      selectPokemon(id) {
        if (this.selectedAnswer === null) {
          this.selectedAnswer = id;
        }
      },
      playAudioPoke() {
        if (this.pokemon.audio) {
          const audioElement = new Audio(this.pokemon.audio);
          audioElement.play();
        }
      },
      async pokemonAudio() {
        if (this.pokemon && this.pokemon.audio) {
          const elementoAudio = new Audio(this.pokemon.audio);
          elementoAudio.volume = 0.05;
          try {
            await elementoAudio.play();
          } catch (error) {
            console.error("Error al reproducir audio:", error);
          }
        } else {
          console.warn("No se encontró URL de audio para este Pokémon");
        }
      },
      showNewGameAlert() {
        this.modal = !this.modal;
        this.newGame();
      },
      showAgainGameAlert() {
        this.modal = !this.modal;
        this.againGame();
      },
      newGame() {
        this.showPokemon = false;
        this.showAnswer = false;
        this.pokemonArr = [];
        this.pokemon = null;
        this.mixPokemonArr();
        this.isDisabled = false;
        this.answerCorrect = false;
        this.modal = false;
        this.pokeData = {};
        this.$router.push('/pokemon-page');
        this.pokeLifes = 3;
      },
      againGame(){
        this.showPokemon = false;
        this.showAnswer = false;
        this.pokemonArr = [];
        this.pokemon = null;
        this.mixPokemonArr();
        this.isDisabled = false;
        this.answerCorrect = false;
        this.modal = false;
        this.pokeData = {};
        this.$router.push('/pokemon-page');
      }
    },
    mounted() {
      this.$router.push('/pokemon-page');
      this.mixPokemonArr();
    }
  }
</script>

<style scoped>
@import url('@/css/styles-components.css');

.page-container {
  display: flex;
  justify-content: center;
  /* height: auto;
  left: 0;
  top: 0;
  width: auto; */
}
.poke-points-container {
  height: auto;
  width: auto;
}
.div-poke-points {
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  color: #000000;
  display: flex;
  flex-direction: column;
  height: auto;
  margin: auto 10px;
  padding: 10px 5px;
  width: auto;
}
.p-poke-points {
  margin: auto;
  padding: 5px;
}
.poke-life-container {
  height: auto;
  width: auto;
}
.div-poke-life {
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  /* border: 1px solid #000000; */
  color: #000000;
  display: flex;
  flex-direction: column;
  height: auto;
  margin: auto 10px;
  padding: 10px 5px;
  width: auto;
}
.img-poke-life {
  /* box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5); */
}
.p-poke-lifes{
  margin: auto;
}
.poke-game-container {
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  color: #000000;
  height: auto;
  left: 0;
  top: 0;
  width: auto;
}
.quiz-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  width: auto;    
  padding: 10px;
  /* position: relative; */
}
.sct-pokemonquiz {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
}
.poke-img {
  position: relative;
  margin: 0 auto;
}
h1 {
  top: 0;
  margin: 10px;
  padding: 00px;
  text-shadow: 0 0 20px #FFFFFF;
}
@media (max-width: 700px) {
  .page-container {
    align-items: center;
    display: flex;
    flex-direction: column;
    /* margin: 20px; */
    /* justify-content: center; */
    /* height: auto; */
    /* row-gap: 20px; */
    /* width: auto; */
  }  
  .poke-game-container{
    width: 100%;
    margin: 5px;
  }
  .poke-life-container {
    margin: 5px;
    width: auto;
  }
  .div-poke-life {
    display: flex;
    flex-direction: row;
    padding: 5px 10px;
  }
}
/* @media (max-width: 700px) {
  .sct-pokemonquiz{
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: auto;
    row-gap: 20px;
    width: auto;
  }
  .sct-pokemonquiz {
    width: 100%;
  }
} */
</style>