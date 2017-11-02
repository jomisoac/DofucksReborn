require('./dofucks.less');

import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import injectTapEventPlugin from 'react-tap-event-plugin'
import App from './app/App';

injectTapEventPlugin();

var Dofucks = React.createClass({
  render: function(){
    return (
      <MuiThemeProvider>
        <div className="root">
          <App />
        </div>
      </MuiThemeProvider>
    )
  }
});

ReactDOM.render(<Dofucks />, document.getElementById('content'));
