// jest.config.js
/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  verbose: true,
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/config/**',
  ],
  // No se necesita 'transform' si no usas Babel o TypeScript
  // transform: {}, // Puedes eliminar esta línea o dejarla vacía

  // Esto podría ser necesario si Jest tiene problemas para interpretar tus archivos .js como ESM
  // aunque con "type": "module" en package.json, Jest debería inferirlo.
  // extensionsToTreatAsEsm: ['.js'],
};

export default config;