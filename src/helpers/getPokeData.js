import {
  pokeApiSpecies,
  pokeApiData,
  pokeApiTypes,
  pokeApiAbility,
} from "@/api/pokeApiData";

const getPokeDescription = async (id) => {
  const promisePokeDataSpecies = pokeApiSpecies.get(`/${id}`);
  const respPokeDataSpecies = await promisePokeDataSpecies;

  const espLavorText = respPokeDataSpecies.data.flavor_text_entries.find(
    (entry) => entry.language.name === "es"
  ).flavor_text;

  const pokeDescription = {
    description: espLavorText,
  };

  return pokeDescription;
};

const getPokeEvoChain = async (id) => {
  //401
  //122 - mr.mime (validar pokes de tipo baby)
  //790
  //711 - el name esta mal en la API
  // const promisePokeDataSpecies = pokeApiSpecies.get(`/${ id }`);
  // const promisePokeDataSpecies = pokeApiSpecies.get(`/711`);
  const promisePokeDataSpecies = pokeApiSpecies.get(`/249`);

  const respPokeDataSpecies = await promisePokeDataSpecies;

  const pokeEvoChainUrl = respPokeDataSpecies.data.evolution_chain.url;
  const resPokeEvoChain = await fetch(pokeEvoChainUrl);
  const pokeEvoChaiData = await resPokeEvoChain.json();
  const pokeEvoChain = pokeEvoChaiData.chain;
  const baseEvoName = pokeEvoChain.species.name;
  // console.log(pokeEvoChain.evolves_to

  let pokeEvoData = {};

  // Valida si el pokemon no tiene evoluciones
  if (pokeEvoChain.evolves_to.length === 0) {
    try {
      const baseEvoData = await pokeApiData.get(`/${baseEvoName}`);
      const baseEvoId = baseEvoData.data.id;
      const descEvo = 'No tiene evoluciones ni evoluciona de otro Pokémon.';

      const baseEvo = {
        id: baseEvoId,
        name: baseEvoName,
        description: descEvo
      };

      pokeEvoData = {
        baseEvo: baseEvo
      };
    } catch (error) {
      console.error(
        `Error al consumir la API "pokeApiData"; el nombre "${baseEvoName}" no existe o es incorrecto.`,
        error
      );
      return pokeEvoData;
    }
  }

  // Valida si el pokemon tiene una primera evolucion
  if (pokeEvoChain.evolves_to.length === 1) {
    try {
      const baseEvoData = await pokeApiData.get(`/${baseEvoName}`);
      const baseEvoId = baseEvoData.data.id;

      const baseEvo = {
        id: baseEvoId,
        name: baseEvoName,
      };

      const firstEvoChain = pokeEvoChain.evolves_to[0];
      const firstEvoName = firstEvoChain.species.name;
      const firstEvoData = await pokeApiData.get(`/${firstEvoName}`);
      const firstEvoId = firstEvoData.data.id;
      const firstEvoDetails = firstEvoChain.evolution_details[0];
      let methodEvo = [];

      for (const key in firstEvoDetails) {
        const value = firstEvoDetails[key];
        if (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          value !== false &&
          key !== "trigger"
        ) {
          methodEvo.push({
            type: key,
            value: typeof value === "object" && value.name ? value.name : value,
          });
        }
      }

      const firstEvo = {
        id: firstEvoId,
        name: firstEvoName,
        pokeEvoReq: [
          {
            methods: methodEvo,
            trigger: firstEvoDetails.trigger.name,
          },
        ],
      };

      const secondEvoChain = firstEvoChain.evolves_to;
      let secondEvo = [];

      // Valida si el pokemon tiene dos evoluciones en su segunda evolucion
      if (secondEvoChain.length === 2) {
        for (const secondEvoChainObj of secondEvoChain) {
          const secondEvoName = secondEvoChainObj.species.name;
          const secondEvoData = await pokeApiData.get(`/${secondEvoName}`);
          const secondEvoId = secondEvoData.data.id;
          const secondEvoDetails = secondEvoChainObj.evolution_details[0];
          const methodEvo = [];

          for (const key in secondEvoDetails) {
            const value = secondEvoDetails[key];

            if (
              value !== null &&
              value !== undefined &&
              value !== "" &&
              value !== false &&
              key !== "trigger"
            ) {
              methodEvo.push({
                type: key,
                value:
                  typeof value === "object" && value.name ? value.name : value,
              });
            }
          }

          secondEvo.push({
            id: secondEvoId,
            name: secondEvoName,
            pokeEvoReq: [
              {
                methods: methodEvo,
                trigger: secondEvoDetails.trigger.name,
              },
            ],
          });
        }
        pokeEvoData = {
          baseEvo: baseEvo,
          firstEvo: firstEvo,
          secondEvo: secondEvo,
        };
      } else {
        // Valida si el pokemon no tiene una segunda evolucion
        if (secondEvoChain.length === 0) {
          pokeEvoData = {
            baseEvo: baseEvo,
            firstEvo: firstEvo,
          };
        } else {
          // Sino, significa que el pokemon si tiene una segunda evolucion
          const secondEvoChain = firstEvoChain.evolves_to[0];
          const secondEvoName = secondEvoChain.species.name;
          const secondEvoData = await pokeApiData.get(`/${secondEvoName}`);
          const secondEvoId = secondEvoData.data.id;
          const secondEvoDetails = secondEvoChain.evolution_details[0];
          let methodEvo = [];

          for (const key in secondEvoDetails) {
            const value = secondEvoDetails[key];
            if (
              value !== null &&
              value !== undefined &&
              value !== "" &&
              value !== false &&
              key !== "trigger"
            ) {
              methodEvo.push({
                type: key,
                value:
                  typeof value === "object" && value.name ? value.name : value,
              });
            }
          }

          secondEvo = {
            id: secondEvoId,
            name: secondEvoName,
            pokeEvoReq: [
              {
                methods: methodEvo,
                trigger: secondEvoDetails.trigger.name,
              },
            ],
          };

          pokeEvoData = {
            baseEvo: baseEvo,
            firstEvo: firstEvo,
            secondEvo: secondEvo,
          };
        }
      }
    } catch (error) {
      console.error(
        `Error al consumir la API "pokeApiData"; el nombre "${baseEvoName}" no existe o es incorrecto.`,
        error
      );
      return pokeEvoData;
    }
  }

  // Valida si el pokemon tiene dos o mas de dos primeras evoluciones
  if (pokeEvoChain.evolves_to.length >= 2) {
    try {
      const baseEvoData = await pokeApiData.get(`/${baseEvoName}`);
      const baseEvoId = baseEvoData.data.id;

      const baseEvo = {
        id: baseEvoId,
        name: baseEvoName,
      };

      let firstEvo = [];
      let secondEvo = [];
      let groupedPoke = {};
      const firstEvoChain = pokeEvoChain.evolves_to;

      // Valida si el pokemon tiene dos evoluciones en su primera evolucion
      if (firstEvoChain.length === 2) {
        for (const firstEvoChainObj of firstEvoChain) {
          const firstEvoName = firstEvoChainObj.species.name;
          const firstEvoData = await pokeApiData.get(`/${firstEvoName}`);
          const firfirstEvoId = firstEvoData.data.id;
          const firstEvoDetails = firstEvoChainObj.evolution_details[0];
          const methodEvo = [];

          for (const key in firstEvoDetails) {
            const value = firstEvoDetails[key];

            if (
              value !== null &&
              value !== undefined &&
              value !== "" &&
              value !== false &&
              key !== "trigger"
            ) {
              methodEvo.push({
                type: key,
                value:
                  typeof value === "object" && value.name ? value.name : value,
              });
            }
          }

          firstEvo.push({
            id: firfirstEvoId,
            name: firstEvoName,
            pokeEvoReq: [
              {
                methods: methodEvo,
                trigger: firstEvoDetails.trigger.name,
              },
            ],
          });

          const secondEvoChain = firstEvoChainObj.evolves_to;

          // Valida si el pokemon no tiene una segunda evolucion
          if (secondEvoChain.length === 0) {
            pokeEvoData = {
              baseEvo: baseEvo,
              firstEvo: firstEvo,
            };
          } else {
            // Sino, obtiene los datos de la segunda evolucion
            for (const secondEvoChainObj of secondEvoChain) {
              const secondEvoName = secondEvoChainObj.species.name;
              const secondEvoData = await pokeApiData.get(`/${secondEvoName}`);
              const secondEvoId = secondEvoData.data.id;
              const secondEvoDetails = secondEvoChainObj.evolution_details[0];
              const methodEvo = [];

              for (const key in secondEvoDetails) {
                const value = secondEvoDetails[key];

                if (
                  value !== null &&
                  value !== undefined &&
                  value !== "" &&
                  value !== false &&
                  key !== "trigger"
                ) {
                  methodEvo.push({
                    type: key,
                    value:
                      typeof value === "object" && value.name
                        ? value.name
                        : value,
                  });
                }
              }

              secondEvo.push({
                id: secondEvoId,
                name: secondEvoName,
                pokeEvoReq: [
                  {
                    methods: methodEvo,
                    trigger: secondEvoDetails.trigger.name,
                  },
                ],
              });
            }
            pokeEvoData = {
              baseEvo: baseEvo,
              firstEvo: firstEvo,
              secondEvo: secondEvo,
            };
          }
        }
      } else {
        // Sino, obtiene los datos de la primera evolucion
        for (const firstEvoChainObj of firstEvoChain) {
          const firstEvoName = firstEvoChainObj.species.name;
          const firstEvoData = await pokeApiData.get(`/${firstEvoName}`);
          const firfirstEvoId = firstEvoData.data.id;
          const firstEvoDetails = firstEvoChainObj.evolution_details;

          for (const evoDetail of firstEvoDetails) {
            const methodEvo = [];

            for (const key in evoDetail) {
              const value = evoDetail[key];
              if (
                value !== null &&
                value !== undefined &&
                value !== "" &&
                value !== false &&
                key !== "trigger"
              ) {
                methodEvo.push({
                  type: key,
                  value:
                    typeof value === "object" && value.name
                      ? value.name
                      : value,
                });
              }
            }

            if (!groupedPoke[firfirstEvoId]) {
              groupedPoke[firfirstEvoId] = {
                name: firstEvoName,
                pokeEvoReq: [],
              };
            }

            groupedPoke[firfirstEvoId].pokeEvoReq.push({
              methods: methodEvo,
              trigger: evoDetail.trigger.name,
            });
          }
        }

        firstEvo = Object.entries(groupedPoke).map(([id, pokeEvoData]) => ({
          id,
          name: pokeEvoData.name,
          pokeEvoReq: pokeEvoData.pokeEvoReq,
        }));

        pokeEvoData = {
          baseEvo: baseEvo,
          firstEvo: firstEvo,
        };
      }
    } catch (error) {
      console.log(
        `Error al consumir la API "pokeApiData"; el nombre "${baseEvoName}" no existe o es incorrecto.`
      );
      return pokeEvoData;
    }
  }

  const pokeEvolutions = {
    evolutions: pokeEvoData,
  };

  // console.log(pokeEvolutions);
  return pokeEvolutions;
};

const getPokeData = async (id) => {
  const respPokeData = await pokeApiData.get(`/${id}`);
  const pokeData = await respPokeData.data;

  let normalAbility = [];
  let hiddenAbility = [];

  pokeData.abilities.forEach((abilityObj) => {
    if (abilityObj.is_hidden) {
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
          description: flavorTextEntriesEs[0].flavor_text,
        };
      } else {
        console.error(
          "Error al obtener el nombre completo de la habilidad oculta:",
          error
        );
        return {
          name: abilitiesNames,
          description: "",
        };
      }
    } catch (error) {
      console.error(
        "Error al obtener el nombre completo de la habilidad oculta:",
        error
      );
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

  if (hiddenAbility.length === 0) {
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
    normal: normalAbility.map((abilityObject) => abilityObject.name),
    hidden: hiddenAbility.map((abilityObject) => abilityObject.name),
  };

  const baseStats = pokeData.stats.map((statObj) => {
    return {
      name: statObj.stat.name,
      baseStat: statObj.base_stat,
    };
  });

  const pokeDataObj = {
    abilities: abilities,
    height: (pokeData.height / 10).toString().replace(".", ","),
    weight: (pokeData.weight / 10).toString().replace(".", ","),
    baseStats: baseStats,
    types: pokeData.types.map((type) => type.type.name),
  };

  return pokeDataObj;
};

const getPokeTypesWkns = async (pokeTypes) => {
  const damageRelationsObj = [];

  const allTypes = [
    "normal",
    "fighting",
    "flying",
    "poison",
    "ground",
    "rock",
    "bug",
    "ghost",
    "steel",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ice",
    "dragon",
    "dark",
    "fairy",
  ];

  for (const typeObj of pokeTypes) {
    const resPokeTypesWkns = await pokeApiTypes.get(`/${typeObj}`);
    const pokeTypesWkns = await resPokeTypesWkns.data.damage_relations;

    if (pokeTypesWkns) {
      const typeDmg = {
        double_dmg_from:
          pokeTypesWkns.double_damage_from?.map((obj) => obj.name) || [],
        half_dmg_from:
          pokeTypesWkns.half_damage_from?.map((obj) => obj.name) || [],
        no_dmg_from: pokeTypesWkns.no_damage_from?.map((obj) => obj.name) || [],
        quadruple_dmg_from: [],
        super_resistance_to: [],
        normal_dmg: [],
      };
      damageRelationsObj.push(typeDmg);
    }
  }

  if (damageRelationsObj.length === 1) {
    // Un solo tipo
    const typeDmg = damageRelationsObj[0];

    if (typeDmg.double_dmg_from.length === 0) {
      typeDmg.double_dmg_from = [
        {
          percentage_dmg: "x2",
          description_dmg: "Débil a:",
          types: ["Ninguno"],
        },
      ];
    } else {
      typeDmg.double_dmg_from = [
        {
          percentage_dmg: "x2",
          description_dmg: "Débil a:",
          types: typeDmg.double_dmg_from.map((type) => type),
        },
      ];
    }

    if (typeDmg.half_dmg_from.length === 0) {
      typeDmg.half_dmg_from = [
        {
          percentage_dmg: "x0.50",
          description_dmg: "Resistente a:",
          types: ["Ninguno"],
        },
      ];
    } else {
      typeDmg.half_dmg_from = [
        {
          percentage_dmg: "x0.50",
          description_dmg: "Resistente a:",
          types: typeDmg.half_dmg_from.map((type) => type),
        },
      ];
    }

    if (typeDmg.no_dmg_from.length === 0) {
      typeDmg.no_dmg_from = [
        {
          percentage_dmg: "x0",
          description_dmg: "Inmune a:",
          types: ["Ninguno"],
        },
      ];
    } else {
      typeDmg.no_dmg_from = typeDmg.no_dmg_from.map((type) => ({
        percentage_dmg: "x0",
        description_dmg: "Inmune a:",
        types: [type],
      }));
    }

    if (typeDmg.quadruple_dmg_from.length === 0) {
      typeDmg.quadruple_dmg_from = [
        {
          percentage_dmg: "x4",
          description_dmg: "Superdébil a:",
          types: ["Ninguno"],
        },
      ];
    }

    if (typeDmg.super_resistance_to.length === 0) {
      typeDmg.super_resistance_to = [
        {
          percentage_dmg: "x0.25",
          description_dmg: "Superresistente a:",
          types: ["Ninguno"],
        },
      ];
    }

    if (typeDmg.normal_dmg.length === 0) {
      typeDmg.normal_dmg = [
        {
          percentage_dmg: "x1",
          description_dmg: "Daño Normal:",
          types: [],
        },
      ];
    }

    for (const type of allTypes) {
      if (
        !typeDmg.double_dmg_from.find((item) => item.types.includes(type)) &&
        !typeDmg.half_dmg_from.find((item) => item.types.includes(type)) &&
        !typeDmg.no_dmg_from.find((item) => item.types.includes(type))
      ) {
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
      double_dmg_from: [
        {
          percentage_dmg: "x2",
          description_dmg: "Débil a:",
          types: [],
        },
      ],
      half_dmg_from: [
        {
          percentage_dmg: "x0.50",
          description_dmg: "Resistente a:",
          types: [],
        },
      ],
      no_dmg_from: [
        {
          percentage_dmg: "x0",
          description_dmg: "Inmune a:",
          types: [],
        },
      ],
      quadruple_dmg_from: [
        {
          percentage_dmg: "x4",
          description_dmg: "Superdébil a:",
          types: [],
        },
      ],
      super_resistance_to: [
        {
          percentage_dmg: "x0.25",
          description_dmg: "Superresistente a:",
          types: [],
        },
      ],
      normal_dmg: [
        {
          percentage_dmg: "x1",
          description_dmg: "Daño normal:",
          types: [],
        },
      ],
    };

    // 1. Super Effective
    const sharedSuperEffective = typeDmgA.double_dmg_from.filter((type) =>
      typeDmgB.double_dmg_from.includes(type)
    );
    results.quadruple_dmg_from[0].types.push(...sharedSuperEffective);

    results.double_dmg_from = [];

    const typeDoubeDmgAFiltered = typeDmgA.double_dmg_from.filter(
      (type) =>
        !typeDmgB.half_dmg_from.includes(type) &&
        !sharedSuperEffective.includes(type)
    );

    const typeDoubleDmgBFiltered = typeDmgB.double_dmg_from.filter(
      (type) => !sharedSuperEffective.includes(type)
    );

    // Combinar los arrays de tipos
    const combinedDoubleDmgTypes = [
      ...typeDoubeDmgAFiltered,
      ...typeDoubleDmgBFiltered,
    ].filter(
      (type) =>
        !typeDmgA.half_dmg_from.includes(type) &&
        !typeDmgB.half_dmg_from.includes(type)
    );

    // Agregar el objeto con tipos combinados a results.double_dmg_from
    results.double_dmg_from.push({
      percentage_dmg: "x2",
      description_dmg: "Débil a:",
      types: combinedDoubleDmgTypes,
    });

    // 2. Super Resistant
    const sharedSuperResistant = typeDmgA.half_dmg_from.filter((type) =>
      typeDmgB.half_dmg_from.includes(type)
    );
    results.super_resistance_to[0].types.push(...sharedSuperResistant);

    results.half_dmg_from = [];

    // Filtrar tipos de half_dmg_from, igual que con double_dmg_from
    const typeHalfDmgAFiltered = typeDmgA.half_dmg_from.filter(
      (type) =>
        !typeDmgB.double_dmg_from.includes(type) &&
        !typeDmgB.half_dmg_from.includes(type) &&
        !sharedSuperEffective.includes(type)
    );
    const typeHalfDmgBFiltered = typeDmgB.half_dmg_from.filter(
      (type) =>
        !typeDmgB.double_dmg_from.includes(type) &&
        !typeDmgB.half_dmg_from.includes(type) &&
        !sharedSuperEffective.includes(type)
    );

    // Combinar los arrays de tipos
    const combinedHalfDmgTypes = [
      ...typeHalfDmgAFiltered,
      ...typeHalfDmgBFiltered,
    ];

    results.half_dmg_from.push({
      percentage_dmg: "x0.50",
      description_dmg: "Resistente a:",
      types: combinedHalfDmgTypes, // El array combinado que generarás
    });

    // 3. double_dmg_from x half_dmg_from
    const exclusiveResistancesA = typeDmgA.half_dmg_from.filter(
      (type) =>
        !typeDmgB.double_dmg_from.includes(type) &&
        !typeDmgB.half_dmg_from.includes(type) &&
        !typeDmgB.no_dmg_from.includes(type) &&
        !results.normal_dmg[0].types.includes(type) &&
        !results.half_dmg_from[0].types.includes(type)
    );

    const exclusiveResistancesB = typeDmgB.half_dmg_from.filter(
      (type) =>
        !typeDmgA.double_dmg_from.includes(type) &&
        !typeDmgA.half_dmg_from.includes(type) &&
        !typeDmgA.no_dmg_from.includes(type) &&
        !results.normal_dmg[0].types.includes(type) &&
        !results.half_dmg_from[0].types.includes(type)
    );

    // Agregar resistencias exclusivas a half_dmg_from
    results.half_dmg_from[0].types.push(
      ...exclusiveResistancesA,
      ...exclusiveResistancesB
    );

    // 4. Immune
    results.no_dmg_from[0].types = [
      ...new Set([...typeDmgA.no_dmg_from, ...typeDmgB.no_dmg_from]),
    ];
    results.half_dmg_from = results.half_dmg_from.filter(
      (type) => !results.no_dmg_from.includes(type)
    );

    // 5. Normal Damage
    results.normal_dmg[0].types = allTypes.filter(
      (type) =>
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

export { getPokeDescription, getPokeEvoChain, getPokeData, getPokeTypesWkns };
