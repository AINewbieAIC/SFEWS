const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true, // ini penting biar className terbaca
});

module.exports = config;
