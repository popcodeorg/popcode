/* eslint-disable react/no-multi-comp */
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import isNil from 'lodash-es/isNil';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  ObjectRootLabel,
  ObjectLabel,
  ObjectInspector,
  DOMInspector,
} from 'react-inspector';
import isElement from 'lodash-es/isElement';

import {ConsoleEntry} from '../records';
import {superJsonParser} from '../previewSupport/jsonParser';

function deserialize(serializedVal) {
  return superJsonParser.parse(serializedVal);
}

function defaultNodeRenderer({depth, name, data, isNonenumerable, expanded}) {
  if (depth === 0) {
    return <ObjectRootLabel data={data} name={name} />;
  }
  return (
    <ObjectLabel data={data} isNonenumerable={isNonenumerable} name={name} />
  );
}

export default function ConsoleOutput({entry, isActive}) {
  const {expression, value, error} = entry;
  const chevron = expression ? (
    <div className="console__chevron console__chevron_outdent">
      <FontAwesomeIcon icon={faChevronLeft} />
    </div>
  ) : null;
  console.log(value);
  if (!isNil(value)) {
    return (
      <div
        className={classnames('console__row', 'console__value', {
          console__value_inactive: !isActive,
        })}
      >
        {chevron}
        {deserialize(value).map((val, i) => {
          // if (
          //   typeof val === 'object' &&
          //   val.$$typeof === Symbol.for('react.element')
          // ) {
          //   console.log('react element!');
          //   return val;
          // }
          // console.log(val);
          // return <ObjectInspector data={val} key={i} />;
          if (isElement(val)) {
            return (
              <DOMInspector
                data={val}
                key={i}
                // nodeRenderer={defaultNodeRenderer}
              />
            );
          }
          if (val === 'undefined') {
            return (
              <ObjectInspector
                data={undefined}
                key={i}
                nodeRenderer={defaultNodeRenderer}
              />
            );
          }
          return (
            <ObjectInspector
              data={val}
              key={i}
              nodeRenderer={defaultNodeRenderer}
            />
          );
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
