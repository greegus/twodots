import config from 'config'

let modifierId = 1;

function generateModifier(position, type, config = {}) {
  return {
    ...config,
    id: `modifier.${modifierId++}`,
    position,
    type
  }
}

export function ice(position) {
  return generateModifier(position, config.modifierTypes.ICE)
}

export function isIce(modifier) {
  return modifier?.type === config.modifierTypes.ICE
}

export default {
  ice,

  isIce
}