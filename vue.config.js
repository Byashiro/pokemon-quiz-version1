const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  outputDir: 'dist',
  transpileDependencies: true,
  configureWebpack: {
    mode: 'production',
    optimization: {
      minimize: true
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
      })
    ]
  }
});


/*
  <div v-for="(pokId, index) in pokedexId" :key="index">
    <img src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{{ this.pokId }}.png`" alt="">
  </div>

*/