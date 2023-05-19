import {config} from '@/config'

import IceModifierComponent from '@/components/canvas/modifiers/IceModifier.vue'
import IceModifierPreviewComponent from '@/components/canvas/modifiers/previews/IceModifier.vue'

import type { Point, ModifierType, Modifier, IceModifier } from '@/types.d';
import type { Component } from 'vue';

let modifierId = 1;

function createModifier<T extends Modifier>(position: Point, type: ModifierType, config: Partial<Omit<T, 'id' | 'position' | 'type'>> = {}): T {
  return {
    ...config,
    id: `modifier.${modifierId++}`,
    position,
    type
  } as T
}

export function createIceModifier(position: Point) {
  return createModifier<IceModifier>(position, config.modifierTypes.ICE)
}

export function isIce(modifier: Modifier): boolean {
  return modifier?.type === config.modifierTypes.ICE
}

export function getModifierComponent(type: ModifierType): Component {
  return {
    [config.modifierTypes.ICE]: IceModifierComponent
  }[type]
}

export function getModifierPreviewComponent(type: ModifierType): Component {
  return {
    [config.modifierTypes.ICE]: IceModifierPreviewComponent
  }[type]
}