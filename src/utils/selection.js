export function isSelectionClosed(selection) {
  const lastSelected = selection[selection.length - 1]
  return selection.findIndex(tile => tile.id === lastSelected.id) < selection.length - 2
}