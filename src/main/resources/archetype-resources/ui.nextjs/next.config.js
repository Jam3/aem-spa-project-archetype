const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');

const nextConfig = {
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))

    return config
  }
};

module.exports = withPlugins(
  [withSass],
  nextConfig
);