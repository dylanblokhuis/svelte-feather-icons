const path = require('path')
const feather = require('feather-icons/dist/icons.json')
const { pascalCase } = require('pascal-case')
const fs = require('fs-extra')

const handleComponentName = name => name.replace(/\-(\d+)/, '$1')

const component = (icon) =>
`<script>
  export let size = "100%";

  if (size !== "100%") {
    size = size.slice(-1) === 'x' 
          ? size.slice(0, size.length -1) + 'em'
          : parseInt(size) + 'px';
  }
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 24 24"  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-${icon.name}">${feather[icon.name]}</svg>
`

const icons = Object.keys(feather).map(name => ({
  name,
  pascalCasedComponentName: pascalCase(`${handleComponentName(name)}-icon`),
  kebabCasedComponentName: `${handleComponentName(name)}-icon`
}))

Promise.all(icons.map(icon => {
  const filepath = `./src/icons/${icon.pascalCasedComponentName}.svelte`
  return fs.ensureDir(path.dirname(filepath))
    .then(() => fs.writeFile(filepath, component(icon), 'utf8'))
})).then(() => {
  const main = icons
    .map(icon => `export { default as ${icon.pascalCasedComponentName} } from './icons/${icon.pascalCasedComponentName}.svelte'`)
    .join('\n\n')
  return fs.outputFile('./src/index.js', main, 'utf8')
})