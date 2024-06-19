import pokemonApi from "@/api/pokemonApi";

const getPokemons = () => {
  const pokemonsArr = Array.from(Array(898));
  return pokemonsArr.map((_, index) => index + 1);
};

const getPokemonOptions = async () => {
  const mixPokemons = getPokemons().sort(() => Math.random() - 0.5);
  const pokemonIds = mixPokemons.splice(0, 4);

  const pokemonsData = await Promise.all(
    pokemonIds.map((id) => pokemonApi.get(`/${id}`))
  );

  const pokemons = pokemonsData.map((pokemon) => ({
    id: pokemon.data.id,
    name: pokemon.data.name,    
    types: pokemon.data.types.map((type) => type.type.name),
    audio: pokemon.data.cries.latest
  }));

  return pokemons;
};

export { getPokemonOptions }