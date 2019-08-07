export function isSelectionClosed(selection) {
  const lastSelected = selection[selection.length - 1]
  return selection.findIndex(tile => tile.id === lastSelected.id) < selection.length - 2
}

export function getTilesEnclosedBySelection(tiles, selection) {
  const lastCoreTile = selection[selection.length - 1]
  const indexOfCoreStart = selection.findIndex(tile => tile.id === lastCoreTile.id)
  const coreSelection = selection.slice(indexOfCoreStart)

  const boundaries = {
    left: Math.min.apply(Math, coreSelection.map(tile => tile.x)),
    right: Math.max.apply(Math, coreSelection.map(tile => tile.x)),
    top: Math.min.apply(Math, coreSelection.map(tile => tile.y)),
    bottom: Math.max.apply(Math, coreSelection.map(tile => tile.y))
  }

  return tiles.filter(tile => (
    tile.x > boundaries.left &&
    tile.x < boundaries.right &&
    tile.y > boundaries.top &&
    tile.y < boundaries.bottom
  ))
}
