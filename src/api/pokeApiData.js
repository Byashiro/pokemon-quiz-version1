import axios from "axios";

const pokeApiSpecies = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/pokemon-species'
});

const pokeApiData = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/pokemon'
});

const pokeApiTypes = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/type'
});

const pokeApiAbility = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/ability'
});

export { pokeApiSpecies, pokeApiData, pokeApiTypes, pokeApiAbility }