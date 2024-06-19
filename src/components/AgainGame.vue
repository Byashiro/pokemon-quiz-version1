<template>
  <div class="modal-message">
    <div class="message-container">
        <p class="parrafo-menssage">Oppps, el Pokémon era <b>{{ pokemonName.toUpperCase() }}</b>.</p>
        <button class="btn-again" @click="againGame">Otra vez</button>
    </div>
  </div>
</template>

<script>
import PokemonPage from '@/pages/PokemonPage'

export default {
    components: {
        PokemonPage
    },
    props: {
        modal: {
            type: Function,
            required: true
        },
        pokemonName: {
            type: String,
            required: true
        },
        againGame: {
            type: Function,
            required: true
        }
    }
}
</script>

<style scoped>
@import url('@/css/styles-components.css');

.modal-message {
    background-color: rgba(0, 0, 0, .3);
    backdrop-filter: blur(1px);
    display: flex;
    height: 100vh;
    left: 0;
    position: fixed;
    top: 0;
    transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
    justify-content: space-around;
    width: 100%;
    z-index: 999;
}
.message-container {
    align-content: center;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 10px;
    height: 100px;
    margin-top: 5px;
    text-align: center;
    width: 300px;
}
.parrafo-menssage{
    margin: 5px auto;
    padding: auto;
}
</style>