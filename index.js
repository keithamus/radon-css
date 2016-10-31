module.exports = function style(styleObject, states) {
  if (typeof styleObject !== 'object') {
    throw new Error('pass in an Object as first argument')
  }
  if (arguments.length === 1) {
    return function (states) {
      return style.apply(null, [styleObject].concat('').concat([].slice.call(arguments)))
    }
  }
  if (arguments.length > 2) {
    states = [].slice.call(arguments, 1)
  }
  states = module.exports.concatStates(states)
  return Object.assign.apply(Object, [{}, styleObject.base].concat(states.map(state => styleObject[state])))
}

module.exports.concatStates = function concatStates() {
  return Array.prototype.reduce.call(arguments, (total, state) => {
    if (typeof state === 'string') {
      total.push(state)
      return total
    }
    if (Array.isArray(state)) {
      return total.concat(concatStates.apply(null, state))
    }
    return total.concat(Object.keys(state || {}).filter(key => state[key]))
  }, [])
}
