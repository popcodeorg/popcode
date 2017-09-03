import classnames from 'classnames';
import {connect} from 'react-redux';
import constant from 'lodash/constant';
import onClickOutside from 'react-onclickoutside';
import partial from 'lodash/partial';
import preventClickthrough from 'react-prevent-clickthrough';
import property from 'lodash/property';
import PropTypes from 'prop-types';
import React from 'react';
import {closeTopBarMenu, toggleTopBarMenu} from '../../actions';
import {getOpenTopBarMenu} from '../../selectors';

export default function createMenu({
  isVisible = constant(true),
  mapPropsToItems,
  name,
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

  return function createMenuWithMappedProps(Label, Item) {
    function Menu(props) {
      if (!isVisible(props)) {
        return null;
      }

      const {isOpen, onClickItem, onToggle} = props;
      const items = mapPropsToItems(props);
      const menu = isOpen ?
        (
          <div
            className="top-bar__menu"
            onClick={preventClickthrough}
          >
            {items.map(({key, enabled, props: itemProps}) => (
              <div
                className={classnames('top-bar__menu-item',
                  {'top-bar__menu-item_active': enabled},
                )}
                key={key}
                onClick={partial(onClickItem, key)}
              >
                <Item {...itemProps} />
              </div>
            ))}
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
          <Label />
          {menu}
        </div>
      );
    }

    Menu.displayName = `Menu(${name})`;

    Menu.propTypes = {
      isOpen: PropTypes.bool.isRequired,
      onClickItem: PropTypes.func.isRequired,
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
