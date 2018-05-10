/* eslint-disable react/no-multi-comp */

import classnames from 'classnames';
import {connect} from 'react-redux';
import constant from 'lodash-es/constant';
import noop from 'lodash-es/noop';
import onClickOutside from 'react-onclickoutside';
import preventClickthrough from 'react-prevent-clickthrough';
import property from 'lodash-es/property';
import PropTypes from 'prop-types';
import React from 'react';
import {closeTopBarMenu, toggleTopBarMenu} from '../../actions';
import {getOpenTopBarMenu} from '../../selectors';

export function MenuItem({children, isActive, isDisabled, onClick}) {
  return (
    <div
      className={classnames('top-bar__menu-item', {
        'top-bar__menu-item_active': isActive,
        'top-bar__menu-item_disabled': isDisabled,
      })}
      onClick={isDisabled ? noop : onClick}
    >
      {children}
    </div>
  );
}

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

MenuItem.defaultProps = {
  isActive: false,
  isDisabled: false,
};

export default function createMenu({
  isVisible = constant(true),
  renderItems,
  name,
  menuClass,
}) {
  function mapStateToProps(state) {
    const isOpen = getOpenTopBarMenu(state) === name;
    return {
      isOpen,
      disableOnClickOutside: !isOpen,
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      onClose() {
        dispatch(closeTopBarMenu(name));
      },

      onToggle() {
        dispatch(toggleTopBarMenu(name));
      },
    };
  }

  return function createMenuWithMappedProps(MenuLaunchButton) {
    function Menu(props) {
      if (!isVisible(props)) {
        return null;
      }

      const {isOpen, onToggle} = props;
      const menu = isOpen ?
        (
          <div
            className={classnames('top-bar__menu', menuClass)}
            onClick={preventClickthrough}
          >
            {renderItems(props)}
          </div>
        ) : null;

      return (
        <div
          className={classnames(
            'top-bar__menu-button',
            {'top-bar__menu-button_active': isOpen},
          )}
          onClick={onToggle}
        >
          <MenuLaunchButton {...props} />
          {menu}
        </div>
      );
    }

    Menu.displayName = `Menu(${name})`;

    Menu.propTypes = {
      isOpen: PropTypes.bool.isRequired,
      onToggle: PropTypes.func.isRequired,
    };

    return connect(mapStateToProps, mapDispatchToProps)(
      onClickOutside(
        Menu,
        {handleClickOutside: property('props.onClose')},
      ),
    );
  };
}
