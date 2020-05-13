export function isSelectionClosed(selection) {
  const lastSelected = selection[selection.length - 1]
  return selection.findIndex(tile => tile.id === lastSelected.id) < selection.length - 2
}

export function getTilesEnclosedBySelection(tiles, selection) {
  const lastCoreTile = selection[selection.length - 1]
  const indexOfCoreStart = selection.findIndex(tile => tile.id === lastCoreTile.id)
  const coreSelection = selection.slice(indexOfCoreStart)

  const boundaries = {
    left: Math.min.apply(Math, coreSelection.map(tile => tile.position.x)),
    right: Math.max.apply(Math, coreSelection.map(tile => tile.position.x)),
    top: Math.min.apply(Math, coreSelection.map(tile => tile.position.y)),
    bottom: Math.max.apply(Math, coreSelection.map(tile => tile.position.y))
  }

  return tiles.filter(tile => (
    !selection.some(({ id }) => tile.id === id) &&
    tile.position.x > boundaries.left &&
    tile.position.x < boundaries.right &&
    tile.position.y > boundaries.top &&
    tile.position.y < boundaries.bottom
  ))
}
