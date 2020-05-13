import config from 'config'

import IceModifier from 'components/canvas/modifiers/IceModifier'
import IceModifierPreview from 'components/canvas/modifiers/previews/IceModifier'

let modifierId = 1;

function createModifier(position, type, config = {}) {
  return {
    ...config,
    id: `modifier.${modifierId++}`,
    position,
    type
  }
}

export function createIceModifier(position) {
  return createModifier(position, config.modifierTypes.ICE)
}

export function isIce(modifier) {
  return modifier?.type === config.modifierTypes.ICE
}

export function getModifierComponent(type) {
  return {
    [config.modifierTypes.ICE]: IceModifier
  }[type]
}

export function getModifierPreviewComponent(type) {
  return {
    [config.modifierTypes.ICE]: IceModifierPreview
  }[type]
}