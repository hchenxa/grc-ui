var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import CheckBoxIcon from './CheckBoxIcon';
import MouseOverTooltip from '../Tooltip';

var Checkbox = function Checkbox(_ref) {
  var className = _ref.className,
      id = _ref.id,
      labelText = _ref.labelText,
      _onChange = _ref.onChange,
      indeterminate = _ref.indeterminate,
      hideLabel = _ref.hideLabel,
      wrapperClassName = _ref.wrapperClassName,
      _ref$title = _ref.title,
      title = _ref$title === undefined ? '' : _ref$title,
      hasGroups = _ref.hasGroups,
      isExpanded = _ref.isExpanded,
      tooltipText = _ref.tooltipText,
      other = _objectWithoutProperties(_ref, ['className', 'id', 'labelText', 'onChange', 'indeterminate', 'hideLabel', 'wrapperClassName', 'title', 'hasGroups', 'isExpanded', 'tooltipText']);

  var input = void 0;
  var labelClasses = classNames('bx--checkbox-label', className);
  var innerLabelClasses = classNames({
    'bx--visually-hidden': hideLabel
  });
  var wrapperClasses = classNames('bx--form-item', 'bx--checkbox-wrapper', wrapperClassName);

  return React.createElement(
    'div',
    { className: wrapperClasses },
    React.createElement('input', _extends({}, other, {
      type: 'checkbox',
      onChange: function onChange(evt) {
        _onChange(input.checked, id, evt);
      },
      className: 'bx--checkbox',
      id: id,
      ref: function ref(el) {
        input = el;
        if (input) {
          input.indeterminate = indeterminate;
        }
      }
    })),
    React.createElement(
      'label',
      { className: labelClasses, title: title || null, htmlFor: id },
      React.createElement(
        'div',
        {
          className: innerLabelClasses,
          style: {
            width: '' + (hasGroups ? 'calc(100% - 28px)' : '100%'),
            display: 'flex'
          } },
        React.createElement(
          'span',
          { style: { maxWidth: '100%' } },
          tooltipText ? React.createElement(
            MouseOverTooltip,
            {
              className: 'bx--checkbox--tooltip',
              showIcon: false,
              tabIndex: -1,
              triggerText: labelText },
            tooltipText
          ) : labelText,
          hasGroups && React.createElement(CheckBoxIcon, { isExpanded: isExpanded })
        )
      )
    )
  );
};

Checkbox.propTypes = {
  /**
   * Specify whether the underlying input should be checked
   */
  checked: PropTypes.bool,

  /**
   * Specify whether the underlying input should be checked by default
   */
  defaultChecked: PropTypes.bool,

  /**
   * Specify whether the Checkbox is in an indeterminate state
   */
  indeterminate: PropTypes.bool,

  /**
   * Specify an optional className to be applied to the <label> node
   */
  className: PropTypes.string,

  /**
   * Specify whether the Checkbox should be disabled
   */
  disabled: PropTypes.bool,

  /**
   * Provide an `id` to uniquely identify the Checkbox input
   */
  id: PropTypes.string.isRequired,

  /**
   * Provide a label to provide a description of the Checkbox input that you are
   * exposing to the user
   */
  labelText: PropTypes.node.isRequired,

  /**
   * Specify whether the label should be hidden, or not
   */
  hideLabel: PropTypes.bool,

  /**
   * Receives three arguments: true/false, the checkbox's id, and the dom event.
   * `(value, id, event) => console.log({value, id, event})`
   */
  onChange: PropTypes.func,

  /**
   * Specify a title for the <label> node for the Checkbox
   */
  title: PropTypes.string,

  /**
   * The CSS class name to be placed on the wrapping element
   */
  wrapperClassName: PropTypes.string
};

Checkbox.defaultProps = {
  onChange: function onChange() {},
  indeterminate: false
};

export default Checkbox;