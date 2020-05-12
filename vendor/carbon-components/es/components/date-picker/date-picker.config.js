/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

var featureFlags = require('../../globals/js/feature-flags');

var _require = require('../../globals/js/settings'),
    prefix = _require.prefix;

var componentsX = featureFlags.componentsX;
module.exports = {
  context: {
    featureFlags: featureFlags,
    prefix: prefix,
    componentsX: componentsX
  }
};