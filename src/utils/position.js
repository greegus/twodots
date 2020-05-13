export function offsetPosition(position, offset) {
  return {
    x: position.x + (offset.x || 0),
    y: position.y + (offset.y || 0)
  }
}