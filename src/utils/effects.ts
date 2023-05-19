import anime from 'animejs'

import { getRandomItem } from '@/utils/array'
import createSvgElement from '@/utils/createSvgElement'
import type { Point } from '@/types.d'

const getRandomColor = () => {
  return getRandomItem(['#FC8181', '#FBD38D', '#9AE6B4', '#90CDF4', '#D6BCFA'])
}

export function animateSparks(canvas: HTMLCanvasElement, { x, y }: Point) {
  const targets = [...Array(8)].map(() => {
    return createSvgElement('circle', {
      fill: getRandomColor(),
      cx: x + 0.5,
      cy: y +0.5,
      r: 0.15,
      'transform-origin': `${x + .5} ${y + .5}`
    })
  })

  targets.forEach(element => canvas.appendChild(element))

  anime({
    targets: targets,
    translateX: () => anime.random(-1, 1),
    translateY: () => anime.random(-1, 1),
    scale: 0,
    opacity: 0,
    easing: 'easeOutSine',
    duration: 500,
    complete: () => targets.forEach(element => canvas?.removeChild(element))
  });
}