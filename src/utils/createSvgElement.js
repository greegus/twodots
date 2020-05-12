export default function createSvgElement(tag, attrs = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag)

  Object.entries(attrs).forEach(([name, value]) => {
    element.setAttribute(name, value)
  })

  return element
}
