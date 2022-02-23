module.exports = {
  webpack5: true,
  webpack: (config, options) => {

  const { ModuleFederationPlugin } = options.webpack.container;
    config.plugins.push(
      new ModuleFederationPlugin({
        remotes: {
          teamDs: "teamDs@http://localhost:3002/remoteEntry.js",
        },
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: false,
          },
        }
      })
    );

     return config;
  }
}