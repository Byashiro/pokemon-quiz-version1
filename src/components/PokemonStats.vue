<template>
    <section class="poke-stats-container">
        <!-- <h3 class="h3-stats">Estadísticas</h3> -->
        <div class="div-stats-container">
            <ul class="ul-stats">
                <li class="li-stats" v-for="stat in pokeStats.baseStats" :key="stat.name">
                    <div class="div-stats-names">
                        <p class="p-stats"
                            :style="{ textShadow: `0 0 5px ${typeColor}` }"                        
                        >
                            {{ statNamesEs[stat.name.toLowerCase()] }}:
                        </p>
                    </div>

                    <div class="div-stats">
                        <p class="p-stats"
                            :style="{ textShadow: `0 0 5px ${typeColor}` }"
                        >
                            {{ stat.baseStat }}
                        </p>
                    </div>

                    <div class="barra-fondo" :style="{ border: `1px solid ${typeColor}` }">
                        <div class="valor-progreso" 
                            :style=" {
                                backgroundColor: typeColor,
                                width: getStatProgressWidth(stat.baseStat) + '%'
                            }"
                        >
                        </div>
                    </div>                
                </li>
                <li class="li-stats">   
                    <div class="div-stats-names">
                        <p class="p-stats"
                            :style="{ textShadow: `0 0 5px ${typeColor}` }"
                        >
                            Total:
                        </p>
                    </div>
                    <div class="div-stats">
                        <p class="p-stats"
                            :style="{ textShadow: `0 0 5px ${typeColor}` }"
                        >
                            {{ totalStats }}
                        </p>
                    </div>
                    <div class="barra-fondo-vacio"></div>
                </li>
           </ul>
        </div>
    </section>
</template>

<script>
import { getPokeData } from '@/helpers/getPokeData'
import { statNameEs } from '@/helpers/pokeStatsNamesEs';
import { colours } from '@/helpers/pokeTypesColours';

export default {
    props: {
        pokeId: Number
    },
    data() {
        return {
            pokeStats: {
                baseStats: []
            },
            pokeTypes: {},
        }
    },
    methods: {
        async getPokeDataInfo() {
            const id = this.pokeId;
            try {
                const pokeData = await getPokeData(id);
                this.pokeStats = pokeData;
                this.pokeTypes = pokeData.types;
            } catch (error) {
                console.error('Error fetching Pokemon data:', error);
            }
        },
        getStatProgressWidth(baseStat) {
            const minBaseStat = 1;
            const maxBaseStat = 255;

            const progress = (baseStat - minBaseStat) / (maxBaseStat - minBaseStat);
            return progress * 100;
        }
    },
    computed: {
        statNamesEs() {
            const traslateEs = {};
            for (const [nameEn, nameEs] of Object.entries(statNameEs)) {
                traslateEs[nameEn.toLowerCase()] = nameEs;
            }
            return traslateEs;
        },
        typeColours() {
            return colours;
        },
        typeColor() {
            if (this.pokeTypes && this.pokeTypes.length > 0) {
                const firstType = this.pokeTypes[0].toLowerCase();
                return this.typeColours[firstType];
            } else {
                return 'none';
            }
        },
        totalStats() {
            return this.pokeStats.baseStats.reduce((sum, stat) => sum + stat.baseStat, 0);
        }
    },
    mounted() {
        this.getPokeDataInfo();
    }
}
</script>

<style scoped>
.poke-stats-container{
    /* box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.7); */
    display: flex;
    height: auto;
    flex-flow: column;
    margin: 10px;
    width: auto;
}
.h3-stats {
    padding: 0;
    margin: 10px;
}
.div-stats-container {
    width: auto;
    margin: 10px;
}
.ul-stats {
    margin: 0;
    list-style: none;
    padding: 0;
}
.li-stats {
    border-bottom: 1px solid #ccc;
    display: flex;
    padding: 5px;
}
.div-stats-names {
    text-align: left;
    width: 180px;
}
.p-stats {
    font-weight: bold;
    margin: auto;
    /* text-shadow: 0 0 5px #0064fa; */
}
.div-stats {
    width: 80px;
    text-align: left;
}
.barra-fondo {
    background-color: #ffffff;
    border-radius: 20px;
    height: 20px;
    /* margin: auto; */
    position: relative;
    width: 100%;
}
.barra-fondo-vacio {
    width: 100%;
}
.valor-progreso {
    border-radius: 10px;
    height: 20px;
    left: 0;
    position: absolute;
    top: 0;
}
.div-name-total {
    text-align: left;
    width: auto;
    margin-right: 5px;
}
</style>