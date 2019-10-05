import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import isNil from 'lodash-es/isNil';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {ObjectInspector, DOMInspector} from 'react-inspector';
import isElement from 'lodash-es/isElement';

import {ConsoleEntry} from '../records';
import {superJsonParser} from '../previewSupport/jsonParser';

function deserialize(serializedVal) {
  return superJsonParser.parse(serializedVal);
}

export default function ConsoleOutput({entry, isActive}) {
  const {expression, value, error} = entry;
  const chevron = expression ? (
    <div className="console__chevron console__chevron_outdent">
      <FontAwesomeIcon icon={faChevronLeft} />
    </div>
  ) : null;

  if (!isNil(value)) {
    return (
      <div
        className={classnames('console__row', 'console__value', {
          console__value_inactive: !isActive,
        })}
      >
        {chevron}
        {deserialize(value).map((val, i) => {
          if (isElement(val)) {
            return <DOMInspector data={val} key={i} />
          } else {
            return <ObjectInspector data={val} key={i} />;
          }
        })}
      </div>
    );
  }

  if (!isNil(error)) {
    return (
      <div
        className={classnames('console__error', {
          console__error_inactive: !isActive,
        })}
      >
        {error.text}
      </div>
    );
  }

  return null;
}

ConsoleOutput.propTypes = {
  entry: PropTypes.instanceOf(ConsoleEntry).isRequired,
  isActive: PropTypes.bool.isRequired,
};
