var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Icon } from 'carbon-components-react';

var CardActionItem = function CardActionItem(_ref) {
  var className = _ref.className,
      id = _ref.id,
      ariaLabel = _ref.ariaLabel,
      iconName = _ref.iconName,
      description = _ref.description,
      other = _objectWithoutProperties(_ref, ['className', 'id', 'ariaLabel', 'iconName', 'description']);

  var cardActionItemClasses = classNames(_defineProperty({
    'bx--app-actions__button': true
  }, className, className));

  return React.createElement(
    'button',
    _extends({}, other, {
      className: cardActionItemClasses,
      id: id,
      'aria-label': ariaLabel }),
    React.createElement(Icon, {
      className: 'bx--app-actions__button--icon',
      name: iconName,
      description: description
    })
  );
};

CardActionItem.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  iconName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

CardActionItem.defaultProps = {
  ariaLabel: '',
  description: 'card action'
};

export default CardActionItem;