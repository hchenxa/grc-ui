/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

var _require = require('../../globals/js/settings'),
    prefix = _require.prefix;

var _require2 = require('../../globals/js/feature-flags'),
    breakingChangesX = _require2.breakingChangesX;

module.exports = {
  hidden: true,
  meta: {
    removed: breakingChangesX,
    useIframe: true
  },
  context: {
    prefix: prefix
  }
};