import { pokeApiSpecies, pokeApiData, pokeApiTypes, pokeApiAbility } from "@/api/pokeApiData";

const getPokeDataSpecies = async( id ) => {
  const promisePokeDataSpecies = pokeApiSpecies.get(`/${ id }`);
  const respPokeDataSpecies = await promisePokeDataSpecies;

  const espLavorText = respPokeDataSpecies.data.flavor_text_entries.find(
    (entry) => entry.language.name === "es"
  ).flavor_text;

  const pokeEvoChainUrl = respPokeDataSpecies.data.evolution_chain.url;
  const resPokeEvoChain = await fetch(pokeEvoChainUrl);
  const pokeEvoChaiData = await resPokeEvoChain.json();
  const pokeEvoChain = pokeEvoChaiData.chain;

  // console.log(pokeEvoChain);

  const getPokeEvoData = async (pokeEvoChain) => {
    const firstEvo = pokeEvoChain.species.name;

    const getPokeDataFirst = await pokeApiData.get(`/${ pokeEvoChain.species.name }`);
    const pokeDataIdFirst = getPokeDataFirst.data.id;

    const secondEvo = pokeEvoChain.evolves_to[0];

    let secondEvoData = {};
    let thirdEvoData = {};

    if (secondEvo) {
      const requirementToSecondEvo = {};
      for (const key in secondEvo.evolution_details[0]) {
        const value = secondEvo.evolution_details[0][key];
        if (value !== null && key !== "trigger" && value !== false && value !== "") {
          requirementToSecondEvo[key] = value;
        }
      }

      const getPokeDataSecond = await pokeApiData.get(`/${ secondEvo.species.name }`);
      const pokeDataIdSecond = getPokeDataSecond.data.id;

      secondEvoData = {
        id: pokeDataIdSecond,
        name: secondEvo.species.name,
        method: secondEvo.evolution_details[0].trigger.name,
        requirementToEvo: requirementToSecondEvo
      };

      const thirdEvo = secondEvo.evolves_to[0];

      if (thirdEvo) {
        const requirementToThirdEvo = {};
        for (const key in thirdEvo.evolution_details[0]) {
          const value = thirdEvo.evolution_details[0][key];
          if (value !== null && key !== "trigger" && value !== false && value !== "") {
            requirementToThirdEvo[key] = value;
          }
        }

        const getPokeDataThird = await pokeApiData.get(`/${ thirdEvo.species.name }`);
        const pokeDataIdThird = getPokeDataThird.data.id;

        thirdEvoData = {
          id: pokeDataIdThird,
          name: thirdEvo.species.name,
          method: thirdEvo.evolution_details[0].trigger.name,
          requirementToEvo: requirementToThirdEvo
        };
      }
    }

    return {
      firstEvo: {
        id: pokeDataIdFirst,
        name: firstEvo 
      },
      secondEvo: secondEvoData,
      thirdEvo: thirdEvoData
    };
  };

  let pokeEvolutions = {};

  if (pokeEvoChain.evolves_to.length > 0) {
    pokeEvolutions = await getPokeEvoData(pokeEvoChain);
  } else {
    const getPokeNoEvo = await pokeApiData.get(`/${ pokeEvoChain.species.name }`);
    const pokeNoEvoId = getPokeNoEvo.data;

    pokeEvolutions = {
      id: pokeNoEvoId.id,
      name: pokeNoEvoId.name
    };
  }

  const pokeSpecies = { 
    description: espLavorText,
    evolutions: pokeEvolutions
  };


  // console.log(pokeSpecies.evolutions);

  return pokeSpecies;
}

const getPokeData = async ( id ) => {
  const respPokeData = await pokeApiData.get(`/${ id }`);
  const pokeData = await respPokeData.data;

  let normalAbility = [];
  let hiddenAbility = [];

  pokeData.abilities.forEach((abilityObj) => {
    if(abilityObj.is_hidden) {
      hiddenAbility.push({ name: abilityObj.ability.name });
    } else {
      normalAbility.push({ name: abilityObj.ability.name });
    }
  });

  const getAbilityName = async (abilitiesNames) => {
    try {
      const respPokeAbility = await pokeApiAbility.get(`/${abilitiesNames}`);
      const pokeDataAbility = await respPokeAbility.data;
      const abilityName = pokeDataAbility.names[5].name;

      const flavorTextEntriesEs = pokeDataAbility.flavor_text_entries.filter(
        (entry) => entry.language.name === "es"
      );

      if (flavorTextEntriesEs.length > 0) {
        return {
            name: abilityName,
            description: flavorTextEntriesEs[0].flavor_text
        };
      } else {
          console.error("Error al obtener el nombre completo de la habilidad oculta:", error);
          return {
              name: abilitiesNames,
              description: ""
          };
      }

    } catch (error) {
      console.error("Error al obtener el nombre completo de la habilidad oculta:", error);
      return "";
    }
  };

  if (normalAbility.length > 1) {
    for (let i = 0; i < normalAbility.length; i++) {
      const abilitiesNames = await getAbilityName(normalAbility[i].name);
      normalAbility[i].name = abilitiesNames;
    }
  } else {
    const abilitiesNames = await getAbilityName(normalAbility[0].name);
    normalAbility[0].name = abilitiesNames;
  }

  if(hiddenAbility.length === 0){
    hiddenAbility = [];
  } else {
    if (hiddenAbility.length > 1) {
      for (let i = 0; i < hiddenAbility.length; i++) {
        const abilitiesNames = await getAbilityName(hiddenAbility[i].name);
        hiddenAbility[i].name = abilitiesNames;
      }
    } else {
      const abilitiesNames = await getAbilityName(hiddenAbility[0].name);
      hiddenAbility[0].name = abilitiesNames;
    }
  }

  const abilities = {
    normal: normalAbility.map(abilityObject => abilityObject.name),
    hidden: hiddenAbility.map(abilityObject => abilityObject.name)
  };

  const baseStats = pokeData.stats.map((statObj) => {
    return {
      name: statObj.stat.name,
      baseStat: statObj.base_stat,
    };
  });

  const pokeDataObj = {
    abilities: abilities,
    height: (pokeData.height / 10).toString().replace('.', ','),
    weight: (pokeData.weight / 10).toString().replace( '.', ',' ),
    baseStats: baseStats,
    types: pokeData.types.map((type) => type.type.name),
  }
  
  return pokeDataObj;
}

const getPokeTypesWkns = async (pokeTypes) => {
  const damageRelationsObj = [];
  
  const allTypes = [
    'normal',
    'fighting',
    'flying',
    'poison',
    'ground',
    'rock',
    'bug',
    'ghost',
    'steel',
    'fire',
    'water',
    'grass',
    'electric',
    'psychic',
    'ice',
    'dragon',
    'dark',
    'fairy',
  ];

  for (const typeObj of pokeTypes) {
    const resPokeTypesWkns = await pokeApiTypes.get(`/${typeObj}`);
    const pokeTypesWkns = await resPokeTypesWkns.data.damage_relations;

    if (pokeTypesWkns) {
      const typeDmg = {
        double_dmg_from: pokeTypesWkns.double_damage_from?.map((obj) => obj.name) || [],
        half_dmg_from: pokeTypesWkns.half_damage_from?.map((obj) => obj.name) || [],
        no_dmg_from: pokeTypesWkns.no_damage_from?.map((obj) => obj.name) || [],
        quadruple_dmg_from: [],
        super_resistance_to: [],
        normal_dmg: []
      };      
      damageRelationsObj.push(typeDmg);
    }
  }

  if (damageRelationsObj.length === 1) {
    // Un solo tipo
    const typeDmg = damageRelationsObj[0];

    if (typeDmg.double_dmg_from.length === 0) {
      typeDmg.double_dmg_from = [{
          percentage_dmg: 'x2',
          description_dmg: 'Débil a:',
          types: ["Ninguno"]
      }];
    } else {
        typeDmg.double_dmg_from = [{
            percentage_dmg: 'x2',
            description_dmg: 'Débil a:',
            types: typeDmg.double_dmg_from.map(type => type)
        }];
    }

    if (typeDmg.half_dmg_from.length === 0) {
      typeDmg.half_dmg_from = [{
          percentage_dmg: 'x0.50',
          description_dmg: 'Resistente a:',
          types: ["Ninguno"]
      }];
    } else {
        typeDmg.half_dmg_from = [{
            percentage_dmg: 'x0.50',
            description_dmg: 'Resistente a:',
            types: typeDmg.half_dmg_from.map(type => type)
        }];
    }

    if (typeDmg.no_dmg_from.length === 0) {
      typeDmg.no_dmg_from = [{
        percentage_dmg: 'x0',
        description_dmg: 'Inmune a:',
        types: ["Ninguno"]
      }];
    } else {
      typeDmg.no_dmg_from = typeDmg.no_dmg_from.map(type => ({
        percentage_dmg: 'x0',
        description_dmg: 'Inmune a:',
        types: [type]
      }));
    }

    if (typeDmg.quadruple_dmg_from.length === 0) {
      typeDmg.quadruple_dmg_from = [{
          percentage_dmg: 'x4',
          description_dmg: 'Superdébil a:',
          types: ["Ninguno"]
      }];
    }

    if (typeDmg.super_resistance_to.length === 0) {
      typeDmg.super_resistance_to = [{
          percentage_dmg: 'x0.25',
          description_dmg: 'Superresistente a:',
          types: ["Ninguno"]
      }];
    }

    if (typeDmg.normal_dmg.length === 0) {
      typeDmg.normal_dmg = [{
          percentage_dmg: 'x1',
          description_dmg: 'Daño Normal:',
          types: []
      }];
    }

    for (const type of allTypes) {
      if (!typeDmg.double_dmg_from.find(item => item.types.includes(type)) &&
          !typeDmg.half_dmg_from.find(item => item.types.includes(type)) &&
          !typeDmg.no_dmg_from.find(item => item.types.includes(type))) {
          typeDmg.normal_dmg[0].types.push(type);
      }
    }
    return typeDmg;

  } else {
    // Dos tipos diferentes
    const typeDmgA = damageRelationsObj[0];
    const typeDmgB = damageRelationsObj[1];

    // Creación del resultado, inicialmente como si fuera un solo tipo
    let results = {
      double_dmg_from: [{
        percentage_dmg: 'x2',
        description_dmg: 'Débil a:',
        types: []
      }],
      half_dmg_from: [{
        percentage_dmg: 'x0.50',
        description_dmg: 'Resistente a:',
        types: []
      }],
      no_dmg_from: [{
        percentage_dmg: 'x0',
        description_dmg: 'Inmune a:',
        types: []
      }],
      quadruple_dmg_from: [{
        percentage_dmg: 'x4',
        description_dmg: 'Superdébil a:',
        types: []
      }],
      super_resistance_to: [{
        percentage_dmg: 'x0.25',
        description_dmg: 'Superresistente a:',
         types: []
      }],
      normal_dmg: [{
        percentage_dmg: 'x1',
        description_dmg: 'Daño normal:',
        types: []
      }]
    };

    // 1. Super Effective
    const sharedSuperEffective = typeDmgA.double_dmg_from.filter(type => typeDmgB.double_dmg_from.includes(type));
    results.quadruple_dmg_from[0].types.push(...sharedSuperEffective);

    results.double_dmg_from = [];

    const typeDoubeDmgAFiltered = typeDmgA.double_dmg_from.filter(type => 
      !typeDmgB.half_dmg_from.includes(type) &&
      !sharedSuperEffective.includes(type)
    );

    const typeDoubleDmgBFiltered = typeDmgB.double_dmg_from.filter(type => 
      !sharedSuperEffective.includes(type)
    );

    // Combinar los arrays de tipos
    const combinedDoubleDmgTypes = [
      ...typeDoubeDmgAFiltered, 
      ...typeDoubleDmgBFiltered 
    ].filter(type =>
        !typeDmgA.half_dmg_from.includes(type) &&
        !typeDmgB.half_dmg_from.includes(type) 
    );

    // Agregar el objeto con tipos combinados a results.double_dmg_from
    results.double_dmg_from.push({
      percentage_dmg: 'x2',
      description_dmg: 'Débil a:',
      types: combinedDoubleDmgTypes
    });

    // 2. Super Resistant
    const sharedSuperResistant = typeDmgA.half_dmg_from.filter(type => typeDmgB.half_dmg_from.includes(type));
    results.super_resistance_to[0].types.push(...sharedSuperResistant);

    results.half_dmg_from = [];

    // Filtrar tipos de half_dmg_from, igual que con double_dmg_from
    const typeHalfDmgAFiltered = typeDmgA.half_dmg_from.filter(type => 
      !typeDmgB.double_dmg_from.includes(type) && 
      !typeDmgB.half_dmg_from.includes(type) && 
      !sharedSuperEffective.includes(type)
    );
    const typeHalfDmgBFiltered = typeDmgB.half_dmg_from.filter(type => 
        !typeDmgB.double_dmg_from.includes(type) &&
        !typeDmgB.half_dmg_from.includes(type) &&
        !sharedSuperEffective.includes(type)
    );

    // Combinar los arrays de tipos
    const combinedHalfDmgTypes = [...typeHalfDmgAFiltered, ...typeHalfDmgBFiltered];

    results.half_dmg_from.push({ 
      percentage_dmg: 'x0.50',
      description_dmg: 'Resistente a:',
      types: combinedHalfDmgTypes // El array combinado que generarás
    });

    // 3. double_dmg_from x half_dmg_from
    const exclusiveResistancesA = typeDmgA.half_dmg_from.filter(type => 
      !typeDmgB.double_dmg_from.includes(type) &&
      !typeDmgB.half_dmg_from.includes(type) &&
      !typeDmgB.no_dmg_from.includes(type) && 
      !results.normal_dmg[0].types.includes(type) &&
      !results.half_dmg_from[0].types.includes(type)
    );

    const exclusiveResistancesB = typeDmgB.half_dmg_from.filter(type => 
      !typeDmgA.double_dmg_from.includes(type) &&
      !typeDmgA.half_dmg_from.includes(type) &&
      !typeDmgA.no_dmg_from.includes(type) &&
      !results.normal_dmg[0].types.includes(type) &&
      !results.half_dmg_from[0].types.includes(type)
    ); 

    // Agregar resistencias exclusivas a half_dmg_from
    results.half_dmg_from[0].types.push(...exclusiveResistancesA, ...exclusiveResistancesB); 

    // 4. Immune
    results.no_dmg_from[0].types = [...new Set([...typeDmgA.no_dmg_from, ...typeDmgB.no_dmg_from])];
    results.half_dmg_from = results.half_dmg_from.filter(type => !results.no_dmg_from.includes(type));

    // 5. Normal Damage
    results.normal_dmg[0].types = allTypes.filter(type => 
      !results.double_dmg_from[0].types.includes(type) &&
      !results.half_dmg_from[0].types.includes(type) &&
      !results.no_dmg_from[0].types.includes(type) &&
      !results.quadruple_dmg_from[0].types.includes(type) &&
      !results.super_resistance_to[0].types.includes(type)
    );

    // Añadir "ninguno" a los arrays vacíos antes de retornar
    for (const damageType in results) {
      const damageCategory = results[damageType];
      for (const element of damageCategory) {
        // Añadimos "ninguno" a los arrays vacíos
        if (element.types.length === 0) {
          element.types.push("Ninguno");
        }
      }
    }
    return results;
  }
};

export { getPokeDataSpecies, getPokeData, getPokeTypesWkns }