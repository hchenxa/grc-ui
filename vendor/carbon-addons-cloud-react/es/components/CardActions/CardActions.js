var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

var CardActions = function CardActions(_ref) {
  var children = _ref.children,
      className = _ref.className,
      other = _objectWithoutProperties(_ref, ['children', 'className']);

  var cardActionClasses = classNames(_defineProperty({
    'bx--card-footer__app-actions': true
  }, className, className));

  return React.createElement(
    'div',
    _extends({ className: cardActionClasses }, other),
    children
  );
};

CardActions.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default CardActions;