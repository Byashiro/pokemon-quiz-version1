<template>
    <section class="options-container">
      <ul class="poke-options-ul">
        <li class="poke-options-li" v-for="pokemon in pokemons" :key="pokemon.id" @click="$emit( 'selection', pokemon.id )" :class="isDisabled ? 'isDisabledList' : ''">
            {{ pokemon.name.toUpperCase() }}
        </li>
      </ul>
    </section>
</template>

<script>
    export default {
        props: {
            pokemons: {
                type: Array,
                required: true
            },
            isDisabled: {
                type: Boolean,
                required: false
            }
        },
        data() {
            return {
                selectedPokemon: null,
                showDetails: false
            }
        },
        methods: {
            selectPokemon(pokemonId) {
                this.isAnswerSelected = true;
                this.showDetails = true;
                this.$emit('selection', pokemonId);
            }
        },
        computed: {
            validated() {
                if (this.isAnswerSelected === true) {
                    return true
                }
            }
        }
    }
</script>

<style scoped>
    .options-container {
        display: flex;
        align-items: center;        
        justify-content: center;
        text-align: center;
        height: auto;
        width: auto;
    }
    .poke-options-ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }
    .poke-options-li {        
        background-color: rgba(34, 40, 49);
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        color: #EEEEEE;
        cursor: pointer;
        margin-bottom: 10px;
        padding: 5px 100px;
    }
    .poke-options-li:hover {
        background-color: rgba(0, 0, 0);
        box-shadow: 0 0 10px 0 rgba(255, 255, 255, 255.5);
    }
    .isDisabledList {
        opacity: 0.5;
        pointer-events: none;
    }
    @media (max-width: 300px) {
        .poke-options-li {
            padding: 5px auto;
        }
    }
</style>