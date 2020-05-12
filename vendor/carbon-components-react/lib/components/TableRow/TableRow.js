"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _carbonComponents = require("carbon-components");

var _FeatureFlags = require("../../internal/FeatureFlags");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var prefix = _carbonComponents.settings.prefix;

var TableRow = function TableRow(props) {
  var _classNames;

  var even = props.even,
      header = props.header,
      className = props.className,
      children = props.children,
      other = _objectWithoutProperties(props, ["even", "header", "className", "children"]);

  var tableRowClasses = (0, _classnames.default)(className, "".concat(prefix, "--table-row"), (_classNames = {}, _defineProperty(_classNames, "".concat(prefix, "--parent-row"), !header), _defineProperty(_classNames, "".concat(prefix, "--parent-row--even"), even), _classNames));
  return _react.default.createElement("tr", _extends({}, other, {
    className: tableRowClasses
  }), children);
};

TableRow.propTypes = {
  /**
   * Specify whether your TableRow should be used as a header row
   */
  header: _propTypes.default.bool,

  /**
   * Specify an optional className to be applied to your TableRow
   */
  className: _propTypes.default.string,

  /**
   * Provide the contents of your TableRow
   */
  children: _propTypes.default.node,

  /**
   * Specify whether the TableRow is at an even position
   */
  even: _propTypes.default.bool
};
TableRow.defaultProps = {
  header: false
};

var _default = !_FeatureFlags.breakingChangesX ? TableRow : null;

exports.default = _default;