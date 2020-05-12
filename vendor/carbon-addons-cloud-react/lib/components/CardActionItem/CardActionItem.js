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

var _carbonComponentsReact = require('carbon-components-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var CardActionItem = function CardActionItem(_ref) {
  var className = _ref.className,
      id = _ref.id,
      ariaLabel = _ref.ariaLabel,
      iconName = _ref.iconName,
      description = _ref.description,
      other = _objectWithoutProperties(_ref, ['className', 'id', 'ariaLabel', 'iconName', 'description']);

  var cardActionItemClasses = (0, _classnames2.default)(_defineProperty({
    'bx--app-actions__button': true
  }, className, className));

  return _react2.default.createElement(
    'button',
    _extends({}, other, {
      className: cardActionItemClasses,
      id: id,
      'aria-label': ariaLabel }),
    _react2.default.createElement(_carbonComponentsReact.Icon, {
      className: 'bx--app-actions__button--icon',
      name: iconName,
      description: description
    })
  );
};

CardActionItem.propTypes = {
  className: _propTypes2.default.string,
  id: _propTypes2.default.string,
  ariaLabel: _propTypes2.default.string,
  iconName: _propTypes2.default.string.isRequired,
  description: _propTypes2.default.string.isRequired
};

CardActionItem.defaultProps = {
  ariaLabel: '',
  description: 'card action'
};

exports.default = CardActionItem;