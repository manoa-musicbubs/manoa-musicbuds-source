import React from 'react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    const divStyle = { height: '100px', color: 'white', backgroundColor: 'black', padding: '1em' };
    return (
      <div className='landing-green-background' style={divStyle}>
        <footer>
          <div className="ui center aligned container">
              The ManoaMusicBubs Project <br />
              University of Hawaii<br />
              Honolulu, HI 96822 <br />
            <a style={{ color: 'white' }} href="https://manoa-musicbubs.github.io/">
              https://manoa-musicbubs.github.io/</a>
          </div>
        </footer>
      </div>
    );
  }
}

export default Footer;
