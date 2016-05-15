module.exports = {
  entry: './site-core.jsx',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'babel', query: { presets: ['react'] } }
    ]
  }
};
