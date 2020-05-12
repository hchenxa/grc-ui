"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _carbonComponents = require("carbon-components");

var _ = _interopRequireDefault(require("@carbon/icons-react/lib/view/16"));

var _2 = _interopRequireDefault(require("@carbon/icons-react/lib/view--off/16"));

var _3 = _interopRequireDefault(require("@carbon/icons-react/lib/warning--filled/16"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var prefix = _carbonComponents.settings.prefix;

var ControlledPasswordInput = _react.default.forwardRef(function ControlledPasswordInput(_ref, ref) {
  var _classNames, _classNames2;

  var alt = _ref.alt,
      labelText = _ref.labelText,
      className = _ref.className,
      id = _ref.id,
      placeholder = _ref.placeholder,
      _onChange = _ref.onChange,
      _onClick = _ref.onClick,
      hideLabel = _ref.hideLabel,
      invalid = _ref.invalid,
      invalidText = _ref.invalidText,
      helperText = _ref.helperText,
      light = _ref.light,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'password' : _ref$type,
      togglePasswordVisibility = _ref.togglePasswordVisibility,
      _ref$hidePasswordText = _ref.hidePasswordText,
      hidePasswordText = _ref$hidePasswordText === void 0 ? 'Hide' : _ref$hidePasswordText,
      _ref$showPasswordText = _ref.showPasswordText,
      showPasswordText = _ref$showPasswordText === void 0 ? 'Show' : _ref$showPasswordText,
      other = _objectWithoutProperties(_ref, ["alt", "labelText", "className", "id", "placeholder", "onChange", "onClick", "hideLabel", "invalid", "invalidText", "helperText", "light", "type", "togglePasswordVisibility", "hidePasswordText", "showPasswordText"]);

  var errorId = id + '-error-msg';
  var textInputClasses = (0, _classnames.default)("".concat(prefix, "--text-input"), "".concat(prefix, "--password-input"), className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefix, "--text-input--light"), light), _defineProperty(_classNames, "".concat(prefix, "--text-input--invalid"), invalid), _classNames));

  var sharedTextInputProps = _objectSpread({
    id: id,
    onChange: function onChange(evt) {
      if (!other.disabled) {
        _onChange(evt);
      }
    },
    onClick: function onClick(evt) {
      if (!other.disabled) {
        _onClick(evt);
      }
    },
    placeholder: placeholder,
    type: type,
    ref: ref,
    className: textInputClasses
  }, other);

  var labelClasses = (0, _classnames.default)("".concat(prefix, "--label"), (_classNames2 = {}, _defineProperty(_classNames2, "".concat(prefix, "--visually-hidden"), hideLabel), _defineProperty(_classNames2, "".concat(prefix, "--label--disabled"), other.disabled), _classNames2));
  var helperTextClasses = (0, _classnames.default)("".concat(prefix, "--form__helper-text"), _defineProperty({}, "".concat(prefix, "--form__helper-text--disabled"), other.disabled));
  var label = labelText ? _react.default.createElement("label", {
    htmlFor: id,
    className: labelClasses
  }, labelText) : null;
  var error = invalid ? _react.default.createElement("div", {
    className: "".concat(prefix, "--form-requirement"),
    id: errorId
  }, invalidText) : null;
  var passwordIsVisible = type === 'text';
  var passwordVisibilityToggleButtonClasses = (0, _classnames.default)("".concat(prefix, "--text-input--password__visibility"), "".concat(prefix, "--tooltip__trigger"), "".concat(prefix, "--tooltip--icon__bottom"), {});
  var passwordVisibilityIcon = passwordIsVisible ? _react.default.createElement(_2.default, {
    className: "".concat(prefix, "--icon-visibility-off")
  }) : _react.default.createElement(_.default, {
    className: "".concat(prefix, "--icon-visibility-on")
  });

  var input = _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("input", _extends({}, (0, _util.textInputProps)({
    invalid: invalid,
    sharedTextInputProps: sharedTextInputProps,
    errorId: errorId
  }), {
    "data-toggle-password-visibility": type === 'password'
  })), _react.default.createElement("button", {
    className: passwordVisibilityToggleButtonClasses,
    "aria-label": alt || "".concat(passwordIsVisible ? hidePasswordText : showPasswordText, " password"),
    onClick: togglePasswordVisibility
  }, passwordVisibilityIcon));

  var helper = helperText ? _react.default.createElement("div", {
    className: helperTextClasses
  }, helperText) : null;
  return _react.default.createElement("div", {
    className: "".concat(prefix, "--form-item ").concat(prefix, "--text-input-wrapper ").concat(prefix, "--password-input-wrapper")
  }, label, helper, _react.default.createElement("div", {
    className: "".concat(prefix, "--text-input__field-wrapper"),
    "data-invalid": invalid || null
  }, invalid && _react.default.createElement(_3.default, {
    className: "".concat(prefix, "--text-input__invalid-icon")
  }), input), error);
});

ControlledPasswordInput.propTypes = {
  /**
   * Provide custom alt text for the password visibility toggle button
   */
  alt: _propTypes.default.string,

  /**
   * Provide a custom className that is applied directly to the underlying
   * <input> node
   */
  className: _propTypes.default.string,

  /**
   * Optionally provide the default value of the <input>
   */
  defaultValue: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),

  /**
   * Specify whether the control is disabled
   */
  disabled: _propTypes.default.bool,

  /**
   * Provide a unique identifier for the input field
   */
  id: _propTypes.default.string.isRequired,

  /**
   * Provide the text that will be read by a screen reader when visiting this
   * control
   */
  labelText: _propTypes.default.node.isRequired,

  /**
   * Optionally provide an `onChange` handler that is called whenever <input>
   * is updated
   */
  onChange: _propTypes.default.func,

  /**
   * Optionally provide an `onClick` handler that is called whenever the
   * <input> is clicked
   */
  onClick: _propTypes.default.func,

  /**
   * Specify the placeholder attribute for the <input>
   */
  placeholder: _propTypes.default.string,

  /**
   * Provide the current value of the <input>
   */
  value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),

  /**
   * Specify whether or not the underlying label is visually hidden
   */
  hideLabel: _propTypes.default.bool,

  /**
   * Specify whether the control is currently invalid
   */
  invalid: _propTypes.default.bool,

  /**
   * Provide the text that is displayed when the control is in an invalid state
   */
  invalidText: _propTypes.default.string,

  /**
   * Provide text that is used alongside the control label for additional help
   */
  helperText: _propTypes.default.node,

  /**
   * Specify light version or default version of this control
   */
  light: _propTypes.default.bool
};
ControlledPasswordInput.defaultProps = {
  alt: '',
  className: 'bx--text__input',
  disabled: false,
  onChange: function onChange() {},
  onClick: function onClick() {},
  invalid: false,
  invalidText: '',
  helperText: '',
  light: false
};
var _default = ControlledPasswordInput;
exports.default = _default;