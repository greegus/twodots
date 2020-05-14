export const isSamePosition = (a, b) => a.x === b.x && a.y === b.y

export const hasValue = (key, value) => item => item[key] === value

export const doesNotHaveValue = (key, value) => item => item[key] !== value

export const hasId = id => hasValue('id', id)

export const doesNotHaveId = id => doesNotHaveValue('id', id)

export const hasPosition = position => item => isSamePosition(item.position, position)

export const notStatic = item => !item.static
