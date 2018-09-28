import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FindPlace from './FindPlace';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<FindPlace />, document.getElementById('root'));

registerServiceWorker();