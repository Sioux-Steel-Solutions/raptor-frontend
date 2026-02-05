// Expo monorepo workaround - redirect to mobile app
// This file exists because expo/AppEntry.js looks for ../../App from root node_modules
export { default } from 'expo-router/entry';
