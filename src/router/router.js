import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
      path: '/',
      redirect: '/pokemon-page'
    },
    {
      path: '/pokemon-page',
      name: 'pokemon-page',
      component: () => import(/*webpackChunkName; "PokemonPage"*/ '@/pages/PokemonPage'),
      children: [
        {
          path: '',
          name: 'pokemon-data',
          component: () => import(/*webpackChunkName; "PokemonData"*/ '@/components/PokemonData'),
          children: [
            {
              path: '/pokemon-page/pokemon-data/pokemon-description/:id',
              name: 'pokemon-description',
              component: () => import(/*webpackChunkName; "PokemonData"*/ '@/components/PokemonDescription'),
              props: ( route ) => {
                const pokeId = Number(route.params.id);
                return { pokeId }
              }
            },
            {
              path: '/pokemon-page/pokemon-data/pokemon-stats/:id',
              name: 'pokemon-stats',
              component: () => import(/*webpackChunkName; "PokemonData"*/ '@/components/PokemonStats'),
              props: ( route ) => {
                const pokeId = Number(route.params.id);
                return { pokeId }
              }
            },
            {
              path: '/pokemon-page/pokemon-data/pokemon-weaknesses/:id',
              name: 'pokemon-weaknesses',
              component: () => import(/*webpackChunkName; "PokemonData"*/ '@/components/PokemonWeaknesses'),
              props: ( route ) => {
                const pokeId = Number(route.params.id);
                return { pokeId }
              }
            },
            {
              path: '/pokemon-page/pokemon-data/pokemon-moves/:id',
              name: 'pokemon-moves',
              component: () => import(/*webpackChunkName; "PokemonData"*/ '@/components/PokemonMoves')
            }
          ]
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/pokemon-page'
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });
  
export default router;