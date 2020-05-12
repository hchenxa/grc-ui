'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Card = function Card(_ref) {
  var children = _ref.children,
      className = _ref.className,
      tabIndex = _ref.tabIndex,
      other = _objectWithoutProperties(_ref, ['children', 'className', 'tabIndex']);

  var cardClasses = (0, _classnames2.default)(_defineProperty({
    'bx--card': true
  }, className, className));

  return _react2.default.createElement(
    'div',
    _extends({}, other, { className: cardClasses, tabIndex: tabIndex }),
    children
  );
};

Card.propTypes = {
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  tabIndex: _propTypes2.default.number,
  onBlur: _propTypes2.default.func,
  onClick: _propTypes2.default.func,
  onFocus: _propTypes2.default.func,
  onKeyDown: _propTypes2.default.func,
  onKeyUp: _propTypes2.default.func,
  onMouseDown: _propTypes2.default.func,
  onMouseEnter: _propTypes2.default.func,
  onMouseLeave: _propTypes2.default.func,
  onMouseUp: _propTypes2.default.func
};

Card.defaultProps = {
  tabIndex: 0
};

exports.default = Card;