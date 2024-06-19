<template>
    <section class="poke-description-container">
        <h4 class="h3-description">Descripción:</h4>
        <p class="poke-description-p">{{ pokeDescription }}</p>
    </section>
    <section class="poke-hw-section">
        <div class="div-w">
            <p class="p-w"><b>Peso:</b> {{ pokeDataObj.weight }} kg</p>
        </div>
        <div class="div-h">
            <p class="p-h"><b>Altura:</b> {{ pokeDataObj.height }} m</p>
        </div>
    </section>
    <section class="poke-abilities-section">
        <div class="div-na">
            <p class="p-na"><b>Habilidad:</b></p>
            <div v-for="normalAbility in pokeDataObj.abilities?.normal" :key="normalAbility" 
                class="div-normalAbility"
            >
                <p class="p-na-name"
                    @mouseover="showDescription(normalAbility)"
                    @mouseleave="hideDescription"
                >
                    {{ normalAbility.name }}
                </p>
            </div>

        </div>
       
        <div v-if="hiddenAbility == true" class="div-ha">
            <p class="p-ha"><b>Hab. oculta:</b></p>
            <div v-for="hiddenAbility in pokeDataObj.abilities?.hidden" :key="hiddenAbility" 
                class="div-hiddenAbility"
            >
                <p class="p-ha-name"
                    @mouseover="showDescription(hiddenAbility)"
                    @mouseleave="hideDescription"
                >
                    {{ hiddenAbility.name }}
                </p>
            </div>
        </div>
                
        <Transition class="description-modal">
            <p v-if="showDescriptionModal"> {{ descriptionToShow }} </p>
        </Transition>
        
    </section>
    <section class="poke-evo-container">
        <h4 class="h4-evo">Evoluciones:</h4>
        <div class="div-evo-container">
            <table class="tab-evo">
                <tr v-if="pokeHaveEvo" class="tr-evo">
                    <div class="div-container-img" v-for="evolutions in filteredEvolutions" :key="evolutions">
                        <!-- <td class="td-evo"> -->
                            <div class="div-evo-img">
                                <img :src="getPokeImg(evolutions.id)" class="img-evo" 
                                    :alt="'Imagen de ' + evolutions.name"
                                >
                            </div>
                            <p class="p-evo"><b>{{ evolutions.name ? evolutions.name.toUpperCase() : '' }}</b></p>
                        <!-- </td> -->
                    </div>
                </tr>
                <!-- <tr v-else class="tr-evo">
                    <div class="div-td-evo">
                        <td class="td-evo">
                            <div class="div-evo-img">
                                <img :src="getPokeImg(pokeEvolutions.id)" class="img-evo" 
                                    :alt="'Imagen de ' + pokeEvolutions.name"
                                >
                            </div>
                        </td>
                        <p class="p-evo"><b>{{ pokeEvolutions.name ? pokeEvolutions.name.toUpperCase() : '' }}</b></p>
                    </div >                        
                </tr> -->
            </table>
        </div>
    </section>
</template>

<script>
import { getPokeDataSpecies, getPokeData } from '@/helpers/getPokeData'

export default {
    data() {
        return {
            pokeDescription: {},
            pokeDataObj: {},
            pokeEvolutions: {},
            pokeHaveEvo: false,
            hiddenAbility: false,
            showDescriptionModal: false
        }
    },
    props: {
        pokeId: Number
    },
    methods: {
        async displayPokemonInfo() {
            const id = this.pokeId;
            try {
                const pokeSpecies = await getPokeDataSpecies( id );
                this.pokeDescription = pokeSpecies.description;
                this.pokeEvolutions = pokeSpecies.evolutions;
                // console.log(this.pokeEvolutions);

                if (Object.keys({ ...this.pokeEvolutions?.firstEvo }).length > 0) {
                    this.pokeHaveEvo = true;
                } else {
                    this.pokeHaveEvo = false;
                }

            } catch (error) {
                console.error('Error fetching PokeData Info:', error);
            }
        },
        async displayPokeData() {
            try {
                const pokeData = await getPokeData( this.pokeId );
                this.pokeDataObj = pokeData;
                this.hiddenAbility = this.pokeDataObj.abilities.hidden.length > 0 ? true : false;
            } catch (error) {
                console.error('Error fetching PokeData Info:', error);
            }
        },
        showDescription(ability) {
            this.descriptionToShow = ability.description;
            this.showDescriptionModal = true
        },
        hideDescription() {
            this.showDescriptionModal = false;
        },
        getPokeImg(evolutionsid, pokeEvolutionsid) {
            const idToUse = evolutionsid || pokeEvolutionsid;
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${idToUse}.gif`;
        },
    },
    computed: {
        filteredEvolutions() {
            return Object.values(this.pokeEvolutions).filter(evolution => Object.keys(evolution).length > 0);
        }
    },
    mounted() {
        this.displayPokemonInfo();
        this.displayPokeData();
    }
}
</script>

<style scoped>
.poke-description-container{
    height: auto;
    justify-content: center;
    margin: 10px;
    width: auto;
}
.h3-description {
    margin: 5px 20px;
}
.poke-description-p {
    padding: 5px;
    margin: auto;
    text-align: left;
    width: auto;
}
.poke-hw-section {
    display: flex;
    height: auto;
    justify-content: space-around;
    margin: 10px;
    width: auto;
}
.div-h, .div-w {
    margin: 5px;
}
.p-h, .p-w {
    margin: auto;
    padding: 5px;
}
.poke-abilities-section {
    /* border: 1px solid #000000; */
    display: flex;
    height: auto;
    justify-content: space-around;
    margin: 10px;
    width: auto;
}
.div-na, .div-ha {
    align-items: center;
    display: flex;
    flex-direction: column;
    padding: 5px;
    margin: 5px;
}
.p-na, .p-ha {
    margin: 0;
}
.p-na-name, .p-ha-name {
    color: #1b61c9;
    font-weight: bold;
    margin: 0;
}
.p-na-name:hover, .p-ha-name:hover {
    color: #000000;
    cursor: pointer;
    font-weight: bold;
}
.description-modal {
    background-color: rgb(255, 255, 255);
    box-shadow: 0 0 10px 0 #000000;
    left: 50%;
    top: 50%;
    padding: 20px;
    position: absolute;
    transform: translate(-50%, -50%);
}
.v-enter-active, .v-leave-active {
    transition: opacity 0.5s ease;
}
.v-enter-from, .v-leave-to {
    opacity: 0;
}
.poke-evo-container { 
    /* border: 1px solid #000000; */
    display: flex;
    height: auto;
    flex-flow: column;
    margin: 10px;
    width: auto;
}
.h4-evo {
    padding: 0;
    margin: 10px;
}
.div-evo-container {
    align-items: center;
    /* border: 1px solid #000000; */
    height: 100%;
    display: flex;
    justify-content: center;
    /* margin: 10px auto; */
    overflow-y: auto;
    width: 100%;
}
.tab-evo {
    align-content: center;
    /* border: 1px solid #000000; */
    /* border-collapse: collapse; */
    display: flex;
    font-size: 80%;
    /* height: 100%; */
    height: 100%;
    justify-content: center;
    margin: 0;
    /* table-layout: fixed; */
    /* width: 100%; */
    width: 100%;
}
.tr-evo {
    align-items: center;
    /* border: 1px solid #000000; */
    display: flex;
    /* flex-direction: column; */
    height: 100%;
    justify-content: center;
    padding: 10px;
    width: 100%;
}
.div-container-img{
    align-content: center;
    /* border: 1px solid #000000; */
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: auto;
    margin: 5px;
    width: auto;
}
/* .td-evo {
    align-items: center;
    border: 1px solid #9605f7;
    display: flex;
    flex-direction: column;
    height: auto;
    justify-content: center;
    margin: 10px;
    padding: 5px;
    width: auto;
} */
.div-evo-img {
    align-items: center;
    /* border: 1px solid #001aff; */
    display: flex;
    height: 130px;
    justify-content: center;
    width: 130px;
}
.img-evo {
    height: auto;
    width: auto;
}
.p-evo {
    /* border: 1px solid #000000; */
    height: auto;
    margin: 3px;
    padding: 3px;
    width: auto;
}
.div-evo-container::-webkit-scrollbar {
    width: 10px;
    height: 8px;
}
.div-evo-container::-webkit-scrollbar-thumb {
    background: #888888;
    border-radius: 5px;
}

@media screen and (max-width: 700px){
    .tr-evo {
        display: flex;
        flex-direction: column;
    }
    .img-evo {

    }
}
</style>