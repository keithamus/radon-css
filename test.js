const concatStates = require('./').concatStates
const radon = require('./')
const expect = require('chai').expect
describe('concatStates', () => {

  it('is variadic', () => {
    expect(concatStates('a', 'b', 'c', 'd', 'e')).to.eql(['a', 'b', 'c', 'd', 'e'])
  })

  it('flattens arrays', () => {
    expect(concatStates(['a', ['b'], [[[['c']]]]])).to.eql(['a', 'b', 'c'])
  })

  it('flattens objects to truthy keys', () => {
    expect(concatStates({ a: true }, { b: false}, { c: true })).to.eql(['a', 'c'])
  })

})

describe('main function', () => {
  const styleFixture = {
    base: {
      background: 'red',
    },
    styleA: {
      background: 'blue',
      border: '1px solid red',
    },
    styleB: {
      border: '1px solid blue',
    }
  }

  it('curries with 1 arg', () => {
    expect(radon({})).to.be.a('function').with.lengthOf(1)
  })

  it('returns new object, with elementName base if no given states', () => {
    expect(radon(styleFixture,  undefined)).to.eql({
      background: 'red',
    })
    expect(radon(styleFixture)()).to.eql({
      background: 'red',
    })
  })

  it('returns new object, with elementName base and additional states merged', () => {
    expect(radon(styleFixture, 'styleA')).to.eql({
      background: 'blue',
      border: '1px solid red',
    })
  })

  it('returns new object, with elementName base and additional states merged (curried)', () => {
    expect(radon(styleFixture)('styleA')).to.eql({
      background: 'blue',
      border: '1px solid red',
    })
  })

  it('returns new object, with elementName base and multiple states merged', () => {
    expect(radon(styleFixture, 'styleA', 'styleB')).to.eql({
      background: 'blue',
      border: '1px solid blue',
    })
  })

  it('returns new object, with elementName base and multiple states merged (curried)', () => {
    expect(radon(styleFixture)('styleA', 'styleB')).to.eql({
      background: 'blue',
      border: '1px solid blue',
    })
  })

  it('respects order', () => {
    expect(radon(styleFixture, 'styleB', 'styleA')).to.eql({
      background: 'blue',
      border: '1px solid red',
    })
  })

  it('respects order (curried)', () => {
    expect(radon(styleFixture)('styleB', 'styleA')).to.eql({
      background: 'blue',
      border: '1px solid red',
    })
  })

  it('can be given objects as states', () => {
    expect(radon(styleFixture, { styleB: true }, { styleA: true })).to.eql({
      background: 'blue',
      border: '1px solid red',
    })
  })

  it('can be given objects as states (curried)', () => {
    expect(radon(styleFixture)({ styleB: true }, { styleA: true })).to.eql({
      background: 'blue',
      border: '1px solid red',
    })
  })

  it('works with the readme example', () => {
    const styles = radon({
      base: {
        margin: 10,
        padding: 10,
        background: '#ccc',
      },
      primary: {
        background: '#0074D9'
      },

      warning: {
        background: '#FF4136'
      }
    })

    // Call the function to get the base styles
    expect(styles()).to.eql({ margin: 10, padding: 10, background: '#ccc' });

    // Call with a state to get a merged style object
    expect(styles('primary')).to.eql({ margin: 10, padding: 10, background: '#0074D9' });
    expect(styles('warning')).to.eql({ margin: 10, padding: 10, background: '#FF4136' });

    // Can call with multiple states, order matters!
    expect(styles('primary', 'warning')).to.eql({ margin: 10, padding: 10, background: '#FF4136' });
    expect(styles('warning', 'primary')).to.eql({ margin: 10, padding: 10, background: '#0074D9' });

    // States could be an object of true/false keys!
    expect(styles({ warning: false, primary: true })).to.eql({ margin: 10, padding: 10, background: '#0074D9' });
    expect(styles({ warning: true })).to.eql({ margin: 10, padding: 10, background: '#FF4136' });
  })

})
