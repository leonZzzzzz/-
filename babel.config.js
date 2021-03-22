module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: ["arithmetic", [
    "component",
    {
      "libraryName": "element-ui",
      "styleLibraryName": "theme-chalk"
    }
  ]]
}
