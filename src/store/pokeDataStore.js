import { defineStore } from "pinia";

export const pokeDataStore = defineStore('pokeData', {
    state: () => {
        return {
            pokeData: {},
            pokeBgImg: null
        }
    },

    actions: {
        setPokeData(data) {
            this.pokeData = data;
        },
        setPokeBgImg(pokeRoute) {
            this.pokeBgImg = pokeRoute;
        },
        deletePokeData() {
            this.pokeData = {}
        }
    }
});