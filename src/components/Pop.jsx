import PropTypes from 'prop-types';
import React from 'react';

import Horns from '../static/images/pop/horns.svg';
import Neutral from '../static/images/pop/neutral.svg';
import Thinking from '../static/images/pop/thinking.svg';

const variants = {
  neutral: Neutral,
  thinking: Thinking,
  horns: Horns,
};

function Pop(props) {
  const PopSvg = variants[props.variant];
  return <PopSvg />;
}

Pop.propTypes = {
  variant: PropTypes.string.isRequired,
};

export default Pop;
