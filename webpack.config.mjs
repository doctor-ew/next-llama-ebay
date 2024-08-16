export default function webpack(config, isServer) {
  config.resolve.fallback = {
    https: false,
    fs: false,
    path: false,
  };

  if (isServer) {
    config.module.rules.push({
      test: /\.node$/,
      loader: "node-loader",
    });

    config.ignoreWarnings = [{ module: /opentelemetry/ }];
  }

  return config;
}
