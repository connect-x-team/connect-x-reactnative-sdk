async function getMetroConfig() {
  const path = await import('path');
  const { getDefaultConfig } = await import('@react-native/metro-config');
  const { withMetroConfig } = await import('react-native-monorepo-config');

  const root = path.default.resolve(__dirname, '..');

  /**
   * Metro configuration
   * https://facebook.github.io/metro/docs/configuration
   *
   * @type {import('metro-config').MetroConfig}
   */
  return withMetroConfig(getDefaultConfig(__dirname), {
    root,
    dirname: __dirname,
  });
}

module.exports = getMetroConfig();
