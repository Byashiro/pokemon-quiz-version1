<template>
    <figure class="picture-container">
        <img :src="imgSrc" class="hidden-pokemon" alt="pokemon">        
        <img v-if="showPokemon" :src="imgSrc" class="fade-in" alt="pokemon">
    </figure>
</template>

<script>
export default {
    props: {
        pokemonId: {
            type: Number,
            required: true
        },
        showPokemon: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    computed: {
        imgSrc() {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${this.pokemonId}.png`            
        }
    },
}
</script>

<style scoped>
.picture-container {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    height: 250px;
    justify-content: center;
    width: 250px;
}
img {
    height: 100%;
    width: 100%;        
    margin: auto;
    position: absolute;
    user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    cursor: pointer;
}
.hidden-pokemon {
    filter: brightness(0);
}
</style>