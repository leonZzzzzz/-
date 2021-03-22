import Vue from 'vue'

function capitalizeFirstLetter(string) {
  // console.log(string.charAt(0).toUpperCase() + string.slice(1));
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const requireComponent = require.context('.', true, /\.vue$/)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = capitalizeFirstLetter(
    fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')
  )
  Vue.component(componentName, componentConfig.default || componentConfig)
})