function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { settings } from 'carbon-components';
import { breakingChangesX } from '../../internal/FeatureFlags';
var prefix = settings.prefix;

var TableHead = function TableHead(props) {
  var children = props.children,
      className = props.className,
      other = _objectWithoutProperties(props, ["children", "className"]);

  var tableHeadClasses = classNames(className, "".concat(prefix, "--table-head"));
  return React.createElement("thead", _extends({}, other, {
    className: tableHeadClasses
  }), children);
};

TableHead.propTypes = {
  /**
   * Provide the contents of your TableHead
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to your TableHead
   */
  className: PropTypes.string
};
export default !breakingChangesX ? TableHead : null;