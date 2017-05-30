function memoize(func) {
  let lastArgs = null
  let lastResult = null

  return (...args) => {
    if (!areArgumentsShallowlyEqual(lastArgs, args)) {
      lastResult = func(...args)
      lastArgs = args
    }

    return lastResult
  }
}

export function createSelector(...funcs) {
  let recomputations = 0
  const resultFunc = funcs.pop()
  const memoizedResultFunc = memoize((...args) => {
    recomputations++
    return resultFunc(...args)
  })

  const selector = memoize((...args) => {
    const params = funcs.map(func => func(...args))
    return memoizedResultFunc(...params)
  })

  selector.recomputations = () => recomputations

  return selector
}

function areArgumentsShallowlyEqual(prev, next) {
  if (prev === null || next === null || prev.
  length !== next.length) {
    return false
  }

  const length = prev.length;
  for (let i = 0; i < length; i++) {
    if (prev[i] !== next[i]) {
      return false
    }
  }

  return true
}
