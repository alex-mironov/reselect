import { createSelector } from './index'

describe('reselect', () => {
  it('performs basic selections', () => {
    const selector = createSelector(
      state => state.a,
      a => a
    )
      const firstState = { a: 1 }
      const firstStateNewPointer = { a: 1 }
      const secondState = { a: 2 }

      expect(selector(firstState)).toEqual(1)
      expect(selector(firstState)).toEqual(1)
      expect(selector.recomputations()).toEqual(1)
      expect(selector(firstStateNewPointer)).toEqual(1)
      expect(selector.recomputations()).toEqual(1)
      expect(selector(secondState)).toEqual(2)
      expect(selector.recomputations()).toEqual(2)
  })

  it('performs basic selections by multiple keys', () => {
    const selector = createSelector(
      state => state.a,
      state => state.b,
      (a, b) => a + b
    )
    const state1 = { a: 1, b: 2 }
    expect(selector(state1)).toEqual(3)
    expect(selector(state1)).toEqual(3)
    expect(selector.recomputations()).toEqual(1)
    const state2 = { a: 3, b: 2 }
    expect(selector(state2)).toEqual(5)
    expect(selector(state2)).toEqual(5)
    expect(selector.recomputations()).toEqual(2)
  })

  it('meets desired cache performance', () => {
    const selector = createSelector(
      state => state.a,
      state => state.b,
      (a, b) => a + b
    )
    const state1 = { a: 1, b: 2 }

    const start = new Date()
    for (let i = 0; i < 1000000; i++) {
      selector(state1)
    }
    const totalTime = new Date() - start
    expect(selector(state1)).toEqual(3)
    expect(selector.recomputations()).toEqual(1)
    expect(totalTime).toBeLessThan(1000, 'Expected a million calls to a selector with the same arguments to take less than 1 second')
  })

  it('performs chaininig selectors', () => {
    const selector1 = createSelector(
      state => state.sub,
      sub => sub
    )
    const selector2 = createSelector(
      selector1,
      sub => sub.value
    )
    const state1 = { sub: {  value: 1 } }
    expect(selector2(state1)).toEqual(1)
    expect(selector2(state1)).toEqual(1)
    expect(selector2.recomputations()).toEqual(1)
    const state2 = { sub: {  value: 2 } }
    expect(selector2(state2)).toEqual(2)
    expect(selector2.recomputations()).toEqual(2)
  })

  it('performs chaininig selectors with props', () => {
    const selector1 = createSelector(
      state => state.sub,
      (state, props) => props.x,
      (sub, x) => ({ sub, x })
    )
    const selector2 = createSelector(
      selector1,
      (state, props) => props.y,
      (param, y) => param.sub.value + param.x + y
    )
    const state1 = { sub: {  value: 1 } }
    expect(selector2(state1, { x: 100, y: 200 })).toEqual(301)
    expect(selector2(state1, { x: 100, y: 200 })).toEqual(301)
    expect(selector2.recomputations()).toEqual(1)
    const state2 = { sub: {  value: 2 } }
    expect(selector2(state2, { x: 100, y: 201 })).toEqual(303)
    expect(selector2.recomputations()).toEqual(2)
  })

  it('performs chaininig selectors with variadic args', () => {
    const selector1 = createSelector(
      state => state.sub,
      (state, props, another) => props.x + another,
      (sub, x) => ({ sub, x })
    )
    const selector2 = createSelector(
      selector1,
      (state, props) => props.y,
      (param, y) => param.sub.value + param.x + y
    )
    const state1 = { sub: {  value: 1 } }
    expect(selector2(state1, { x: 100, y: 200 }, 100)).toEqual(401)
    expect(selector2(state1, { x: 100, y: 200 }, 100)).toEqual(401)
    expect(selector2.recomputations()).toEqual(1)
    const state2 = { sub: {  value: 2 } }
    expect(selector2(state2, { x: 100, y: 201 }, 200)).toEqual(503)
    expect(selector2.recomputations()).toEqual(2)
  })
})
