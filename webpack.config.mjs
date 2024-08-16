export default function webpack(config, isServer) {
  // Only apply node-loader if you absolutely need it for .node files
  if (isServer) {
    config.module.rules.push({
      test: /\.node$/,
      loader: "node-loader",
    });

    config.ignoreWarnings = [{ module: /opentelemetry/ }];
  }

  // Resolve fallback for aws4 library
  config.resolve.fallback = {
    aws4: false,
  };

  return config;
}
