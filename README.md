# Radon CSS. Miniature DIY Radium

> # No Longer Actively Maintained
> If someone would like to take over maintainence, feel free to get in touch ([@keithamus on twitter](https://twitter.com/keithamus). I'll happily transfer this over.

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/ygkcNhfZ9nTDeVM6P8LSGn1C/keithamus/radon-css'>  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/ygkcNhfZ9nTDeVM6P8LSGn1C/keithamus/radon-css.svg' /></a>

Radon is a lightweight version of Radium. It has no dependencies, does not
require React, and is very very small. ("Fun" fact: Radon, the gas, is the
product of Radium decay).

Radium is a cool library for React which lets you use style objects in clever
ways, inside of your react code. However Radium is really built for class based
components, and is not particularly lightweight - it handles its own state,
overrides the render method, and injects hooks onto your react elements to
manage states like hover. Radon CSS (this package) attempts to take Radium's
pattern, and apply it in the simplest way possible.

With Radon CSS, simply specify your Style object - as a set of top level keys,
which represent your elements, each one containing a sub-level of states for
that element. You'll get back a function which can bind to those elements, and
in turn merge a set of states into one style object... it's better said with
code:

```js
const radon = require('radon-css');

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
```

This is all Radon does, so if you want to add pseudo interactivity styles, which
Radium does out of the box, then it is up to you to do so manually! It is
relatively simple to do so:

```js
import React, { Component } from 'react';
import radon from 'radon';
const MyButtonStyles = radon({
  base: {
    border: '2px solid #ccc',
  },
  hover: {
    border: '2px solid #aaa'
  },
  focus: {
    border: '2px solid #333'
  }
})
class MyButton extends Component {

  constructor() {
    super(arguments);
    this.state = { hover: false, focus: false }
  }

  render() {
    return (
      <div
        style={MyButtonStyles(this.state)}
        onMouseEnter={() => this.setState({hover: true})}
        onMouseLeave={() => this.setState({hover: false})}
        onFocus={() => this.setState({focus: true})}
        onBlur={() => this.setState({focus: false})}
      >
      My Element
      </div>
    )
  }

}
