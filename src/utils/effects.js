import anime from 'animejs'

import { getRandomItem } from 'utils/array'
import createSvgElement from 'utils/createSvgElement'

const getRandomColor = () => {
  return getRandomItem(['#FC8181', '#FBD38D', '#9AE6B4', '#90CDF4', '#D6BCFA'])
}

export function animateSparks(canvas, { x, y }) {


  const targets = [...Array(8)].map(() => {
    return createSvgElement('circle', {
      fill: getRandomColor(),
      cx: x + 0.5,
      cy: y +0.5,
      r: 0.15,
      'transform-origin': `${x} ${y}`
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
    duration: () => anime.random(400, 600),
    complete: () => targets.forEach(element => canvas?.removeChild(element))
  });
}