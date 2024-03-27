import pokemonApi from "@/api/pokemonApi"

const getPokemons = () => {
    const pokemonsArr = Array.from( Array(650) )
    //El metodo map es un metodo de los arrays que sirve para
    //mapear cada elemento del array y transformarlo
    return pokemonsArr.map( (_, index) => index + 1 )
}

const getPokemonOptions = async() => {
    //-0.5 a -1 se le suma porque el indice empieza en cero, pero queremos que comience en uno
    const mixPokemons = getPokemons().sort( () => Math.random() - 0.5 )
    //splice  nos permite cortar el arreglo en dos partes
    //el primer parametro es donde comenzamos a cortar
    //el segundo parametro son cuantas posiciones queremos cortar
    const pokemons = await getPokemonNames( mixPokemons.splice(0,4) )
    // console.table(pokemons)
    return pokemons
}

const getPokemonNames = async( [a,b,c,d] = [] ) => {
    // const resp = await pokemonApi.get(`/${1}`)
    // console.log(resp.data.name, resp.data.id)
    // console.log(a,b,c,d)

    const promiseArr = [
        pokemonApi.get(`/${ a }`),
        pokemonApi.get(`/${ b }`),
        pokemonApi.get(`/${ c }`),
        pokemonApi.get(`/${ d }`)
    ]

    //Promise.all dispara varias promesas de manera simultanea
    const [ p1, p2, p3, p4 ] = await Promise.all( promiseArr )
    // console.log(allResp)
    return [
        { name: p1.data.name, id: p1.data.id },
        { name: p2.data.name, id: p2.data.id },
        { name: p3.data.name, id: p3.data.id },
        { name: p4.data.name, id: p4.data.id }
    ]

}

export default getPokemonOptions