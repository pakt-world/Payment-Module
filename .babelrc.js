module.exports = {
  env: {
    test: {
      presets: [
        '@babel/env',
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
      plugins: [
        'babel-plugin-dynamic-import-node',
        '@babel/plugin-transform-runtime',
      ],
    },
  },
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
        targets: {
          esmodules: true,
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    [
      '@babel/plugin-transform-class-properties',
      {
        loose: true,
      },
    ],
    '@babel/plugin-transform-object-rest-spread',
  ],
};
