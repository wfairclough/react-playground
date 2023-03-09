import cssnano from 'cssnano';
module.exports = {
  plugins: {
    autoprefixer: {},
    cssnano: cssnano({
      preset: 'default',
    }),
  },
};
