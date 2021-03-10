import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const App = ({ gon }) => (
  <ul>
    {gon.channels.map((c) => <li key={c.name}>{c.name}</li>)}
  </ul>
);

App.propTypes = {
  gon: PropTypes.shape({
    channels: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      removable: PropTypes.bool,
    })),
    currentChannelId: PropTypes.number,
    messages: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

export default (container, gon) => {
  ReactDOM.render(<App gon={gon} />, container);
};
