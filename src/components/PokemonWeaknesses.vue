<template>
    <section class="poke-weaks-container">
        <!-- <h3 class="h4-weaks">Debilidades y resistencias</h3> -->
        <div class="div-weaks-container">
            <table class="tab-weaks">
                <thead>
                    <tr class="tr-head">
                        <th class="th-dmg">Multi. daño</th>
                        <th class="th-description">Descripción</th>
                        <th class="th-types">Tipos</th>
                    </tr>
                </thead>
                <tbody class="tbody-weak">
                    <tr v-for="weakness in pokeTypesWkns.quadruple_dmg_from" :key="weakness" class="tr-super-weak"> 
                        <td class="td-percentage_dmg">{{ weakness.percentage_dmg }}</td>
                        <td class="td-description_dmg">{{ weakness.description_dmg }}</td>
                        <td class="td-types">
                            <span v-if="weakness.types[0] === 'Ninguno'">Ninguno</span>
                            <div v-if="weakness.types.length >= 1 && weakness.types[0] !== 'Ninguno'" class="div-types">
                                <a v-for="(pokeType, index) in weakness.types" :key="index" class="a-types"
                                    :style="{ backgroundColor: typeColours[pokeType.toLowerCase()] }"
                                >
                                    {{ typePokeEs[pokeType.toLowerCase()] }}
                                </a>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="weakness in pokeTypesWkns.double_dmg_from" :key="weakness" class="tr-super-weak"> 
                        <td class="td-percentage_dmg">{{ weakness.percentage_dmg }}</td>
                        <td class="td-description_dmg">{{ weakness.description_dmg }}</td>
                        <td class="td-types">
                            <span v-if="weakness.types[0] === 'Ninguno'">Ninguno</span>
                            <div v-if="weakness.types.length >= 1 && weakness.types[0] !== 'Ninguno'"  class="div-types">
                                <a v-for="(pokeType, index) in weakness.types" :key="index" class="a-types"
                                    :style="{ backgroundColor: typeColours[pokeType.toLowerCase()] }"
                                >
                                    {{ typePokeEs[pokeType.toLowerCase()] }}
                                </a>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="weakness in pokeTypesWkns.normal_dmg" :key="weakness" class="tr-super-weak"> 
                        <td class="td-percentage_dmg">{{ weakness.percentage_dmg }}</td>
                        <td class="td-description_dmg">{{ weakness.description_dmg }}</td>
                        <td class="td-types">
                            <span v-if="weakness.types[0] === 'Ninguno'">Ninguno</span>
                            <div v-if="weakness.types.length >= 1 && weakness.types[0] !== 'Ninguno'"  class="div-types">
                                <a v-for="(pokeType, index) in weakness.types" :key="index" class="a-types"
                                    :style="{ backgroundColor: typeColours[pokeType.toLowerCase()] }"
                                >
                                    {{ typePokeEs[pokeType.toLowerCase()] }}
                                </a>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="weakness in pokeTypesWkns.half_dmg_from" :key="weakness" class="tr-super-weak"> 
                        <td class="td-percentage_dmg">{{ weakness.percentage_dmg }}</td>
                        <td class="td-description_dmg">{{ weakness.description_dmg }}</td>
                        <td class="td-types">
                            <span v-if="weakness.types[0] === 'Ninguno'">Ninguno</span>
                            <div v-if="weakness.types.length >= 1 && weakness.types[0] !== 'Ninguno'"  class="div-types">
                                <a v-for="(pokeType, index) in weakness.types" :key="index" class="a-types"
                                    :style="{ backgroundColor: typeColours[pokeType.toLowerCase()] }"
                                >
                                    {{ typePokeEs[pokeType.toLowerCase()] }}
                                </a>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="weakness in pokeTypesWkns.super_resistance_to" :key="weakness" class="tr-super-weak"> 
                        <td class="td-percentage_dmg">{{ weakness.percentage_dmg }}</td>
                        <td class="td-description_dmg">{{ weakness.description_dmg }}</td>
                        <td class="td-types">
                            <span v-if="weakness.types[0] === 'Ninguno'">Ninguno</span>
                            <div v-if="weakness.types.length >= 1 && weakness.types[0] !== 'Ninguno'"  class="div-types">
                                <a v-for="(pokeType, index) in weakness.types" :key="index" class="a-types"
                                    :style="{ backgroundColor: typeColours[pokeType.toLowerCase()] }"
                                >
                                    {{ typePokeEs[pokeType.toLowerCase()] }}
                                </a>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="weakness in pokeTypesWkns.no_dmg_from" :key="weakness" class="tr-super-weak"> 
                        <td class="td-percentage_dmg">{{ weakness.percentage_dmg }}</td>
                        <td class="td-description_dmg">{{ weakness.description_dmg }}</td>
                        <td class="td-types">
                            <span v-if="weakness.types[0] === 'Ninguno'">Ninguno</span>
                            <div v-if="weakness.types.length >= 1 && weakness.types[0] !== 'Ninguno'"  class="div-types">
                                <a v-for="(pokeType, index) in weakness.types" :key="index" class="a-types"
                                    :style="{ backgroundColor: typeColours[pokeType.toLowerCase()] }"
                                >
                                    {{ typePokeEs[pokeType.toLowerCase()] }}
                                </a>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>


<script>
import { getPokeData, getPokeTypesWkns } from '@/helpers/getPokeData';
import { colours } from '@/helpers/pokeTypesColours';
import { typePokeEs } from '@/helpers/pokeTypesEs';

export default {
    data() {
        return {
            pokeTypes: {},
            pokeTypesWkns: {}
        }
    },
    props: {
        pokeId: Number
    },
    methods: {
        async getPokeDataInfo() {
            const id = this.pokeId;
            try {
                const pokeData = await getPokeData( id );
                this.pokeTypes = pokeData.types;
                const pokeTypeWkns = await getPokeTypesWkns( this.pokeTypes );
                this.pokeTypesWkns = pokeTypeWkns;
                console.log(this.pokeTypesWkns);
            } catch (error) {
                console.error('Error fetching PokeData Info:', error);
            }
        },
    },
    computed: {
        typeColours() {
            return colours;        
        },
        typePokeEs() {
            return typePokeEs;
        }
    },
    mounted() {
        this.getPokeDataInfo();
    }
}
</script>

<style scoped>
.poke-weaks-container {
    display: flex;
    height: auto;
    flex-flow: column;
    margin: 10px;
    width: auto;
}
.h4-weaks {
    padding: 0;
    margin: 10px;
}
.div-weaks-container {
    margin: 10px;
    max-width: 100%;
    overflow-y: auto;
}
.tab-weaks {
    border-collapse: collapse;
    font-size: 80%;
    margin: 0 auto;        
    table-layout: fixed;
    width: 100%;
}
.tbody-weak {
    vertical-align: middle;
    unicode-bidi: isolate;
    border-color: inherit;
}
.tr-head {
    background: #000000;
    border: 1px solid #000000;
    color: #ffffff;
}
.th-dmg {
    width: 50px;
}
.th-description {
    width: 120px;
}
.th-types {
    width: 250px;
}
td {
    color: #000000;
}
.td-percentage_dmg {
    border-right: 1px solid #000000;
    border-left: 1px solid #000000;
    border-bottom: 1px solid #000000;
}
.td-description_dmg {
    border-right: 1px solid #000000;
    border-bottom: 1px solid #000000;
}
.td-types {
    border-right: 1px solid #000000;
    border-bottom: 1px solid #000000;
}
.div-types {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}
.a-types {
    border-radius: 10px;
    margin: 3px 5px;
    padding: 5px 10px;
    text-shadow: 0 0 0px #000000;
    width: 60px;
}
.div-weaks-container::-webkit-scrollbar {
    width: 10px;
    height: 8px;
}
.div-weaks-container::-webkit-scrollbar-thumb {
    background: #888888;
    border-radius: 5px;
}

@media screen and (max-width: 750px){
    .div-types {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
    }
    .a-types {
        border-radius: 10px;
        margin: 3px 5px;
        padding: 5px 10px;
        text-shadow: 0 0 0px #000000;
        width: 60px;
    }
}
</style>